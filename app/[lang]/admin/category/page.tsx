"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminPageHeader from "@/components/AdminPageHeader";
import { getUserRole } from "@/lib/roles";

type CategoryRow = {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
  created_at: string;
};

type CategoryForm = {
  name: string;
  image_url: string;
  description: string;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  image_url: "",
  description: "",
};

export default function AdminCategoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [createForm, setCreateForm] = useState<CategoryForm>(EMPTY_FORM);
  const [createImageFile, setCreateImageFile] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage({ type: "error", text: "Please sign in to manage categories." });
      setIsLoading(false);
      return;
    }

    const role = await getUserRole(user.id);
    if (role !== "admin") {
      setIsAdmin(false);
      setMessage({ type: "error", text: "Only admins can access category management." });
      setIsLoading(false);
      return;
    }

    setIsAdmin(true);

    const categoriesQuery: any = supabase.from("categories");
    const { data, error } = await categoriesQuery
      .select("id, name, image_url, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: `Failed to load categories: ${error.message}` });
      setIsLoading(false);
      return;
    }

    setCategories((data ?? []) as CategoryRow[]);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!createImageFile) {
      setCreateImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(createImageFile);
    setCreateImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [createImageFile]);

  useEffect(() => {
    if (!editImageFile) {
      setEditImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(editImageFile);
    setEditImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [editImageFile]);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 1024) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);

    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(categories.length / cardsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    return categories.slice(start, start + cardsPerPage);
  }, [categories, currentPage, cardsPerPage]);

  const validateForm = (form: CategoryForm) => {
    if (!form.name.trim()) return "Category name is required.";
    return null;
  };

  const uploadCategoryImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `categories/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("categories")
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      throw new Error(
        `Image upload failed: ${uploadError.message}. Ensure a public storage bucket named "categories" exists.`
      );
    }

    const { data } = supabase.storage.from("categories").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCreate = async () => {
    const validationError = validateForm(createForm);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    if (!createImageFile) {
      setMessage({ type: "error", text: "Please upload one category image." });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const categoriesQuery: any = supabase.from("categories");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let imageUrl = "";

    try {
      imageUrl = await uploadCategoryImage(createImageFile);
    } catch (error) {
      setIsSaving(false);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to upload image.",
      });
      return;
    }

    const { error } = await categoriesQuery.insert({
      name: createForm.name.trim(),
      image_url: imageUrl,
      description: createForm.description.trim() || null,
      created_by: user?.id ?? null,
    });

    if (error) {
      setMessage({ type: "error", text: `Create failed: ${error.message}` });
    } else {
      setCreateForm(EMPTY_FORM);
      setCreateImageFile(null);
      setCurrentPage(1);
      setMessage({ type: "success", text: "Category created successfully." });
      await fetchCategories();
    }

    setIsSaving(false);
  };

  const startEdit = (category: CategoryRow) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      image_url: category.image_url,
      description: category.description ?? "",
    });
    setEditImageFile(null);
    setEditImagePreview("");
    setMessage(null);
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditImageFile(null);
    setEditImagePreview("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const validationError = validateForm(editForm);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    let imageUrl = editForm.image_url;

    if (editImageFile) {
      try {
        imageUrl = await uploadCategoryImage(editImageFile);
      } catch (error) {
        setIsSaving(false);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to upload image.",
        });
        return;
      }
    }

    const categoriesQuery: any = supabase.from("categories");
    const { error } = await categoriesQuery
      .update({
        name: editForm.name.trim(),
        image_url: imageUrl,
        description: editForm.description.trim() || null,
      })
      .eq("id", editingId);

    if (error) {
      setMessage({ type: "error", text: `Update failed: ${error.message}` });
    } else {
      closeEditModal();
      setMessage({ type: "success", text: "Category updated successfully." });
      await fetchCategories();
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(`Delete category "${name}"?`);
    if (!confirmed) return;

    setIsSaving(true);
    setMessage(null);

    const categoriesQuery: any = supabase.from("categories");
    const { error } = await categoriesQuery.delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: `Delete failed: ${error.message}` });
    } else {
      if (editingId === id) {
        setEditingId(null);
      }
      setMessage({ type: "success", text: `Category "${name}" deleted.` });
      await fetchCategories();
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Category Management"
        subtitle="Create and manage custom categories (name and image required)"
      />

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {!isAdmin && !isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          You do not have permission to manage categories.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Create Category</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-1 lg:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category Name *</label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Beach House"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#5b2d8e]"
                />
              </div>

              <div className="space-y-1 lg:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateImageFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:border-[#5b2d8e]"
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short optional description for this category"
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#5b2d8e]"
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image Preview</p>
                {createImagePreview ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={createImagePreview}
                      alt="New category preview"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-xs text-slate-500">
                    Upload one image to see a live preview.
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={isSaving || isLoading}
                className="rounded-lg bg-[#5b2d8e] px-4 py-2 text-sm font-medium text-white hover:bg-[#4c2476] disabled:opacity-60"
              >
                Create Category
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: cardsPerPage }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 h-44 w-full rounded-xl bg-slate-200" />
                  <div className="mb-2 h-5 w-2/3 rounded bg-slate-200" />
                  <div className="mb-2 h-4 w-full rounded bg-slate-100" />
                  <div className="mb-5 h-4 w-1/3 rounded bg-slate-100" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded-lg bg-slate-200" />
                    <div className="h-8 w-16 rounded-lg bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No categories yet.</div>
          ) : (
            <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedCategories.map((category) => (
                <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <>
                    <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-2">
                      <div className="flex h-44 w-full items-center justify-center rounded-lg bg-white">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{category.description || "No description"}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        disabled={isSaving}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(category.id, category.name)}
                        disabled={isSaving}
                        className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isActive = page === currentPage;

                    return (
                      <button
                        key={`page-${page}`}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-md px-3 py-1.5 text-sm ${
                          isActive
                            ? "bg-[#5b2d8e] text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {editingId !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">Edit Category</h3>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      disabled={isSaving}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category Name *</label>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Beach House"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#5b2d8e]"
                      />
                    </div>

                    <div className="space-y-1 lg:col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Replace Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:border-[#5b2d8e]"
                      />
                      <p className="text-xs text-slate-500">Leave empty to keep current image.</p>
                    </div>

                    <div className="space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Short optional description for this category"
                        rows={5}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#5b2d8e]"
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image Preview</p>
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={editImagePreview || editForm.image_url}
                          alt={`${editForm.name} preview`}
                          className="h-44 w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      disabled={isSaving}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleUpdate()}
                      disabled={isSaving}
                      className="rounded-lg bg-[#5b2d8e] px-3 py-2 text-sm font-medium text-white hover:bg-[#4c2476] disabled:opacity-60"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
          )}
        </>
      )}
    </div>
  );
}
