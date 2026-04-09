"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  DoorOpen,
  Copy,
  Archive,
  DollarSign,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getUserRole } from "@/lib/roles";

interface Listing {
  id: string;
  host_id: string;
  title: string;
  accommodation_name: string;
  description: string;
  property_type: string;
  location: string;
  address: string;
  price_per_night: number;
  min_nights: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  house_images?: {
    image_url: string;
    sort_order: number;
  }[];
  status: string;
  created_at: string;
}

type CategoryOption = {
  id: number;
  name: string;
  image_url?: string | null;
};

type HouseCategoryTag = {
  category_id: number;
  name: string;
};

export function ListingList() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const lang = params?.lang as string;
  const isAdminListingsPage = pathname?.includes("/admin/listings");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(9); // 3x3 grid
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  const [houseCategories, setHouseCategories] = useState<HouseCategoryTag[]>(
    [],
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [isAssigningCategory, setIsAssigningCategory] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch listings from Supabase
  const fetchListings = async (page: number = 1) => {
    try {
      setLoading(true);

      // Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/${lang || "en"}/login`);
        return;
      }

      const role = await getUserRole(session.user.id);
      const isAdmin = role === "admin";

      // Get total count first
      let countQuery = supabase
        .from("houses")
        .select("id", { count: "exact", head: true });

      if (!isAdmin) {
        countQuery = countQuery.eq("host_id", session.user.id);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error("Error counting listings:", countError);
        setError(countError.message);
        return;
      }

      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let dataQuery = supabase
        .from("houses")
        .select(
          `
            *,
            house_images (
              image_url,
              sort_order
            )
          `,
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!isAdmin) {
        dataQuery = dataQuery.eq("host_id", session.user.id);
      }

      const { data, error } = await dataQuery;

      if (error) {
        console.error("Error fetching listings:", error);
        setError(error.message);
        return;
      }

      setListings(data || []);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async (houseId: string) => {
    const [categoriesRes, houseCategoriesRes] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, image_url")
        .order("name", { ascending: true }),
      (supabase as any)
        .from("house_categories")
        .select("category_id, categories ( id, name )")
        .eq("house_id", houseId),
    ]);

    if (!categoriesRes.error) {
      setAllCategories((categoriesRes.data || []) as CategoryOption[]);
    }

    if (!houseCategoriesRes.error) {
      const mapped = ((houseCategoriesRes.data || []) as any[])
        .map((item) => ({
          category_id: item.category_id as number,
          name: item.categories?.name as string,
        }))
        .filter((item) => item.category_id && item.name);
      setHouseCategories(mapped);
      setSelectedCategoryIds(mapped.map((item) => item.category_id));
    } else {
      setCategoryMessage(
        `Category links unavailable: ${houseCategoriesRes.error.message}`,
      );
    }
  };

  const openCategoryModalForListing = async (houseId: string) => {
    setSelectedListingId(houseId);
    setCategorySearch("");
    setCategoryMessage(null);
    setOpenDropdown(null);
    setIsCategoryModalOpen(true);
    await fetchCategoryData(houseId);
  };

  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((idValue) => idValue !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleAssignCategory = async () => {
    if (!selectedListingId) return;

    const existingCategoryIds = houseCategories.map(
      (category) => category.category_id,
    );
    const existingCategoryIdSet = new Set(existingCategoryIds);
    const selectedCategoryIdSet = new Set(selectedCategoryIds);

    const categoryIdsToInsert = selectedCategoryIds.filter(
      (categoryId) => !existingCategoryIdSet.has(categoryId),
    );
    const categoryIdsToDelete = existingCategoryIds.filter(
      (categoryId) => !selectedCategoryIdSet.has(categoryId),
    );

    if (categoryIdsToInsert.length === 0 && categoryIdsToDelete.length === 0) {
      setCategoryMessage("No category changes to save.");
      setIsCategoryModalOpen(false);
      return;
    }

    setIsAssigningCategory(true);
    setCategoryMessage(null);

    if (categoryIdsToInsert.length > 0) {
      const payload = categoryIdsToInsert.map((categoryId) => ({
        house_id: selectedListingId,
        category_id: categoryId,
      }));

      const { error: assignError } = await (supabase as any)
        .from("house_categories")
        .insert(payload);

      if (assignError) {
        if (assignError.code === "23505") {
          setCategoryMessage(
            "This category is already assigned to this house.",
          );
        } else {
          setCategoryMessage(
            `Failed to assign category: ${assignError.message}`,
          );
        }
        setIsAssigningCategory(false);
        return;
      }
    }

    if (categoryIdsToDelete.length > 0) {
      const { error: removeError } = await (supabase as any)
        .from("house_categories")
        .delete()
        .eq("house_id", selectedListingId)
        .in("category_id", categoryIdsToDelete);

      if (removeError) {
        setCategoryMessage(`Failed to remove category: ${removeError.message}`);
        setIsAssigningCategory(false);
        return;
      }
    }

    setCategoryMessage("Categories updated successfully.");
    await fetchCategoryData(selectedListingId);
    setIsCategoryModalOpen(false);
    setCategorySearch("");
    setIsAssigningCategory(false);
  };

  const filteredCategories = allCategories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase().trim()),
  );

  // Delete listing
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase.from("houses").delete().eq("id", id);

      if (error) {
        console.error("Error deleting listing:", error);
        setError(error.message);
        return;
      }

      // Refresh listings
      fetchListings(currentPage);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete listing");
    }
  };

  // Toggle publish status
  const togglePublish = async (id: string, currentStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from("houses")
        .update({ status: currentStatus === "active" ? "inactive" : "active" })
        .eq("id", id);

      if (error) {
        console.error("Error updating listing:", error);
        setError(error.message);
        return;
      }

      // Refresh listings
      fetchListings(currentPage);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update listing");
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`listing-skeleton-${index}`}
                className="flex items-center gap-4 p-4"
              >
                <div className="h-24 w-24 animate-pulse rounded-lg bg-slate-200" />

                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />

                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((__, actionIndex) => (
                    <div
                      key={`listing-skeleton-action-${index}-${actionIndex}`}
                      className="h-11 w-11 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Plus className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No listings yet
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first listing
        </p>
        <Link
          href={`/${lang || "en"}/host/new`}
          className="inline-flex items-center px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href={`/${lang || "en"}/host/new`}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Link>
      </div>

      {/* List View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Image Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                {listing.house_images &&
                listing.house_images.length > 0 &&
                listing.house_images[0].image_url ? (
                  <Image
                    src={listing.house_images[0].image_url}
                    alt={listing.title || "Property image"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Listing Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                      {listing.accommodation_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize">
                        {listing.property_type}
                      </span>
                      <span>•</span>
                      <span>{listing.bedrooms} bedrooms</span>
                      <span>•</span>
                      <span>{listing.max_guests} guests</span>
                      <span>•</span>
                      <span className="font-semibold text-gray-900">
                        €{listing.price_per_night}/night
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      listing.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {listing.status === "active" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={
                    isAdminListingsPage
                      ? `/${lang || "en"}/admin/listings/show/${listing.id}`
                      : `/${lang || "en"}/host/show/${listing.id}`
                  }
                  className="p-3 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                  title="View listing"
                >
                  <Eye className="h-5 w-5" />
                </Link>
                <Link
                  href={`/${lang || "en"}/host/edit/${listing.id}`}
                  className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit listing"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                {/* More Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === listing.id ? null : listing.id,
                      )
                    }
                    className="p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="More actions"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === listing.id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <Link
                          href={`/${lang || "en"}/host/rooms/${listing.id}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <DoorOpen className="h-4 w-4" />
                          Add Room
                        </Link>
                        <Link
                          href={`/en/account/special-pricing`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <DollarSign className="h-4 w-4" />
                          Special Pricing
                        </Link>
                        {isAdminListingsPage && (
                          <button
                            type="button"
                            onClick={() =>
                              void openCategoryModalForListing(listing.id)
                            }
                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Tag className="h-4 w-4" />
                            Add Category
                          </button>
                        )}
                        {/* <button
                          onClick={() => {
                            // Handle duplicate listing
                            setOpenDropdown(null);
                            alert('Duplicate listing feature coming soon!');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          Duplicate Listing
                        </button>
                        <button
                          onClick={() => {
                            togglePublish(listing.id, listing.status);
                            setOpenDropdown(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Archive className="h-4 w-4" />
                          {listing.status === 'active' ? 'Unpublish' : 'Publish'}
                        </button> */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm w-screen h-screen">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Select Categories
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                disabled={isAssigningCategory}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              {categoryMessage && (
                <p className="text-sm text-slate-600">{categoryMessage}</p>
              )}

              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#5b2d8e]"
              />

              <div className="max-h-[55vh] overflow-y-auto pr-1">
                {filteredCategories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredCategories.map((category) => {
                      const isSelected = selectedCategoryIds.includes(
                        category.id,
                      );
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategorySelection(category.id)}
                          className={`relative overflow-hidden rounded-xl border bg-white text-left transition hover:shadow-md ${
                            isSelected
                              ? "border-[#5b2d8e] ring-2 ring-[#5b2d8e]/25"
                              : "border-slate-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="absolute right-2 top-2 h-4 w-4 cursor-pointer accent-[#5b2d8e]"
                          />
                          <div className="h-28 w-full bg-slate-100">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                              {category.name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    No categories found for this search.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-600">
                Selected: {selectedCategoryIds.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isAssigningCategory}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleAssignCategory()}
                  disabled={isAssigningCategory}
                  className="rounded-lg bg-[#5b2d8e] px-4 py-2 text-sm font-medium text-white hover:bg-[#4c2476] disabled:opacity-60"
                >
                  {isAssigningCategory ? "Saving..." : "Submit Categories"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
            listings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchListings(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.ceil(totalCount / itemsPerPage) },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchListings(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? "bg-forest-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchListings(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
