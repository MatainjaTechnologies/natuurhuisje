'use client';

import { Home, Heart, Shield, Award, TreePine, Compass, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

export function AdditionalSections() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`py-16 bg-neutral-50 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Discover essential information about your nature getaway, from general guidelines to nature tips and travel advice.
          </p>
        </div>

        <Tabs defaultValue="general" className={`w-full max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="nature" className="flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              Nature
            </TabsTrigger>
            <TabsTrigger value="travel-tips" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Travel Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Weekend away</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-neutral-600 leading-relaxed">
                    A weekend getaway is the perfect way to completely unwind. And if it were up to us, the best place for that is in the heart of nature. Even if it's only for a few days, it can feel like a long vacation. Away from the hustle and bustle. A few days without having to do anything is a wonderful feeling. You don't have to travel far for a weekend in nature, with plenty of options in <a href="#" className="text-purple-600 hover:underline">the Netherlands</a> and our neighboring countries <a href="#" className="text-purple-600 hover:underline">Belgium</a> and <a href="#" className="text-purple-600 hover:underline">Germany</a>. Looking for a long weekend getaway? Then check out our selection for a few days in France or Spain. Whatever destination you choose, at Natuurhuisje you'll find the most beautiful and unique cottages surrounded by nature, for a weekend of peace, space, and relaxation.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">A weekend in a special house</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    At Natuurhuisje.nl, you'll find many unique accommodations for your weekend getaway. Unleash your inner child and spend the night in a <a href="#" className="text-purple-600 hover:underline">treehouse</a> during your weekend getaway. Are the kids coming along? They're sure to talk about it for ages. And how about a "wrapped house"? A weekend in a "wrapped house" will make you feel at one with nature. A "wrapped house" is a unique Dutch concept made of cardboard. Don't worry, an extra layer ensures the house stays dry. For a little more space, you can stay in a <a href="#" className="text-purple-600 hover:underline">holiday farm</a> or a <a href="#" className="text-purple-600 hover:underline">bungalow</a>. Ideal for larger groups and a change from a standard hotel or apartment. And if you really want to unwind completely, choose a <a href="#" className="text-purple-600 hover:underline">weekend getaway in a wellness cottage</a>.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Long weekend away in nature</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    For a long weekend getaway, you can stay in the Netherlands, or venture a little further afield to <a href="#" className="text-purple-600 hover:underline">Luxembourg</a>, <a href="#" className="text-purple-600 hover:underline">France</a>, or even <a href="#" className="text-purple-600 hover:underline">Spain</a>. In Luxembourg, you'll enjoy unspoiled nature, magnificent palaces, and tranquility. The friendly locals are happy to welcome you for a weekend getaway in their holiday cottage. In France, you'll drive past beautiful vineyards, stop for a croissant or baguette, and experience French life on a terrace among the locals. Book a weekend getaway in Spain through Natuurhuisje and enjoy endless sandy beaches, delicious tapas, and charming villages. Besides vibrant cities like Barcelona and Madrid, popular Spain still boasts many undiscovered spots. After a long weekend of relaxation in one of the unique accommodations on Natuurhuisje.nl, you'll have a richer experience and give back to nature. With your booking, you support local nature projects.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Popular destinations for a weekend away</h4>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    During a weekend getaway through Natuurhuisje, you'll always be surrounded by nature, far from the crowds, in small-scale accommodations. Explore the area from your holiday home, alone, with your dog, or with your family, friends, or colleagues. Can't choose from the many beautiful destinations? Then read on for popular weekend getaway destinations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway at the seaside</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway Zeeland</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway in Friesland</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway Gelderland</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway Overijssel</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend getaway Ardennes</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Weekend away on Texel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nature" className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">A weekend away full of nature</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                Discover the beautiful natural surroundings during a weekend getaway in the Netherlands or Europe: from mountains to sandy plains and forests to waterscapes. You'll also encounter a wide variety of animals during your weekend getaway: from fish to deer and from birds of prey to foxes. There's something for everyone.
              </p>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Landscapes</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Europe boasts a wealth of landscapes. Think of beautiful mountain ranges, lakes, coastal landscapes, and beaches. The Netherlands is known for its heathlands, but you'll also find other landscapes here, such as waterscapes, sandy plains, and forests. The Netherlands also boasts many lakes, just like the rest of Europe. Beautiful mountains can be found in the Belgian Ardennes, the Spanish Pyrenees, and the French Alps. Coastal landscapes can be found in many countries for your weekend getaway, but Portugal arguably boasts the most beautiful coastline. The Algarve is known for its stunning steep cliffs, caves, bays, and rugged rock formations. Prefer to relax on the beach during your weekend getaway? That's certainly possible in the Netherlands, but Northern Germany and Belgium also boast surprising beaches. Want to be guaranteed beautiful weather? Then choose a beach area in Spain or Portugal.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Flora & Fauna in Western and Central Europe</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    The flora and fauna in Western and Central Europe are diverse and well worth exploring for your weekend getaway. Did you know that Belgium is covered in forests for about 20 percent of its territory? It's also one of the greenest countries in Western Europe. Trees you'll encounter frequently in Belgium, but actually throughout Western and Central Europe, during your weekend getaway include oaks, beeches, birches, elms, ash trees, and deciduous trees. In the higher elevations, you'll also find spruces and pines. France is known for its extensive vineyards and wine regions. You'll also find beautiful flowers like daffodils and lavender in France. In Germany, for example, you'll find various species of ferns, flowers, fungi, and mosses.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    Animals that live in Western and Central Europe include deer, roe deer, wild boar, foxes, otters, beavers, and wildcats. Seals, porpoises, and even dolphins also live along the German coast. Wolf species are also reappearing in some places in Europe, including the Dutch Veluwe National Park. Bird lovers can also indulge themselves during a weekend getaway in Europe. You can encounter species such as storks, woodpeckers, various owls, and various birds of prey.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Flora and fauna during a weekend getaway in Southern Europe</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Southern Europe also boasts a diverse flora and fauna to enjoy on a weekend getaway. For example, in northern Portugal and Spain, you'll find many trees such as chestnut, oak, birch, and pine. Central Portugal, a less green, wooded area, is known for its beautiful vineyards, olive groves, and almond trees. These almond trees are also found in southern Portugal, as are fig and orange trees. You'll also find eucalyptus forests and many other flowers in Portugal, such as lavender and sunflowers. In Spain, you'll find many orchids and, of course, the Spanish national flower: the red carnation.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    Southern Europe is home to a wide variety of animals, from small to large. Large animals are mainly found in Spain. For example, you'll find bears, wolves, lynxes, and chameleons in Spain. Wolves and lynxes also live in Portugal, but they are less common here than in Spain. Deer, goats, wild boars, rabbits, and hares are more common in Portugal. In southern Spain, near Gibraltar, there are even monkeys. With a bit of luck, you might even encounter dolphins along the coast of Southern Europe. Bird lovers will also find plenty to enjoy in Southern Europe. Portugal, for example, is an important part of the great biennial bird migration, a remarkable phenomenon. Bird species you can admire in Southern Europe include storks, herons, flamingos, squirrels, buzzards, and guillemots.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">National parks to visit during your weekend getaway</h4>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    There's so much to see in Europe. Everywhere you look, you'll find national parks with their own unique characteristics. One area boasts sand drifts and heathlands, another mountain ranges. Each park also has its own unique inhabitants. For example, one park boasts a huge population of vultures, while in another you'll find unusual mammals like the lynx. Below, we've listed a few national parks perfect for your weekend getaway:
                  </p>

                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">National parks in the Netherlands</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        A weekend getaway in the Netherlands? The Netherlands boasts no fewer than 21 national parks, so there's plenty to see and explore. Each park has its own unique character. For example, you might find areas with sand dunes in one park and green meadows with Scottish Highland cattle in another. You can explore them all by bike or on foot. Or even from the water.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        Discover <a href="#" className="text-purple-600 hover:underline">Hoge Veluwe National Park</a>, one of the Netherlands' most famous areas, with its heathlands and sand drifts surrounded by forests. But there are many more parks to discover that are perhaps less well-known. <a href="#" className="text-purple-600 hover:underline">Oosterschelde National Park</a> in Zeeland is a paradise for water lovers. There's plenty to discover here, both on and in the water. For example, you can dive into an underwater world where you can spot unique creatures like anemones, cuttlefish, starfish, and seahorses. Fun and educational. And if you're a true night-time enthusiast, <a href="#" className="text-purple-600 hover:underline">Lauwersmeer National Park</a> is for you. Here, you'll find complete darkness at night, the only place in the Netherlands where you can often admire a magnificent starry sky. Both parks offer something extra special for your weekend getaway.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">Discover the nature reserves of Belgium</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        Belgium has only one national park, <a href="#" className="text-purple-600 hover:underline">Hoge Kempen National Park</a>. This park borders Limburg and is a great place to visit during a weekend getaway in Belgium. With 200 kilometers of hiking trails, you can easily spend a weekend here. There are also plenty of beautiful nature reserves in Belgium with plenty to see. Take <a href="#" className="text-purple-600 hover:underline">Middelheim Park</a>, for example, an area south of Antwerp. Here, besides beautiful nature, you'll also find more than 200 sculptures. Art lovers will certainly find plenty to enjoy. Or visit <a href="#" className="text-purple-600 hover:underline">Hallerbos</a>, south of Brussels. This forest is known for its bluebells, earning it the nickname "Blue Forest," a unique phenomenon. The best time to visit is in spring, when the bluebells are in bloom.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">Visit one of Germany's rugged national parks</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        Germany boasts 16 national parks with stunning natural areas. <a href="#" className="text-purple-600 hover:underline">Eifel National Park</a> is a beautiful park located a three-hour drive from Utrecht. The park's landscape has been largely shaped by past volcanic eruptions. Even though there haven't been any volcanic eruptions for many years, many of them are still visible in the landscape. For example, craters have become lakes. A unique phenomenon in the park is the Devil's Gorge. This rock formation has taken on bizarre shapes over millions of years.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        Looking for a combination of water sports and nature? About a four-hour drive from Utrecht, you'll find the <a href="#" className="text-purple-600 hover:underline">Kellerwald-Edersee National Park</a>. Here you can enjoy swimming and surfing while admiring the beautiful scenery.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        Going for a long weekend by car, or don't mind driving a bit further? Then it's definitely worth visiting the <a href="#" className="text-purple-600 hover:underline">Harz National Park</a>, a park known for its ruggedness and mystery. This park is about a five-hour drive from Utrecht, and you'll find rugged cliffs and bizarre rock formations, numerous pine trees, and countless streams. The nature is both pure and untamed. In this park, you'll find the 1,141-meter-high Brocken, the highest mountain in Northern Germany. It's a large protected area with beautiful flora and fauna. You might even encounter a lynx or a capercaillie in the park.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">Northern France, a world of difference</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        Northern France boasts several beautiful parks that are easily accessible by car. Just a four-hour drive from Utrecht lies the <a href="#" className="text-purple-600 hover:underline">Regional Park of the Caps and Marais d'Opale</a>. This coastal area is characterized by two famous capes: Cap Blanc Nez and Cap Gris Nez. It's a stunning phenomenon and perfect for a weekend getaway in northern France. You'll also find many charming villages surrounding the park.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        Another park, also about a four-hour drive from Utrecht, is the <a href="#" className="text-purple-600 hover:underline">French Ardennes Regional Park</a>. The French Ardennes is a beautiful area, slightly more rugged and unspoiled than the Belgian Ardennes.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">Spot large animals in one of the parks during your weekend away in Spain</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        Spain is a pioneer in national parks and boasts no fewer than 15. For example, you'll find the <a href="#" className="text-purple-600 hover:underline">Sierra Nevada National Park</a>, the largest in Spain. Located in Andalusia, this park boasts high mountains, some reaching heights of up to 3,000 meters. More than 60 plant species found only in this region thrive here. A truly special place for plant lovers.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        In recent years, the Spanish ibex population has been growing. You'll also find badger and wildcat here, for example. Are you a true bird lover? Then <a href="#" className="text-purple-600 hover:underline">Monfragüe National Park</a> is the ideal destination. It's home to the largest population of vultures in the world. No fewer than three hundred pairs of black vultures, 12 pairs of imperial eagles, 30 pairs of black storks, 35 pairs of Egyptian vultures, and 1,000 pairs of griffon vultures live here.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-neutral-900 mb-2">Visit one of Portugal's national parks during your long weekend getaway</h5>
                      <p className="text-neutral-600 leading-relaxed">
                        Portugal also boasts several national parks. Planning a weekend getaway in northern Portugal? Then consider visiting <a href="#" className="text-purple-600 hover:underline">Serra da Estrela National Park</a>. This area is characterized by its numerous mountain ranges, creating a diverse landscape: from deep valleys and rocky outcrops to magnificent, dense oak forests. In this national park, you can still find traces of ancient tribal cultures, which is quite remarkable. You can also enjoy beautiful hikes that will take you to the park's best spots.
                      </p>
                      <p className="text-neutral-600 leading-relaxed mt-2">
                        Or are you planning a weekend getaway to southern Portugal? In the south, you'll find <a href="#" className="text-purple-600 hover:underline">Vale do Guadiana National Park</a>. This is a valley through which the Guadiana River flows, hence its name. Here you'll find, among other things, the largest waterfall in Southern Europe. Definitely worth a visit!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="travel-tips" className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Travel tips for your weekend getaway</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                During your weekend getaway, you can choose from a wide range of activities. Explore nature with a lovely walk or bike ride, for example. Or perhaps you'd prefer something more adventurous like mountain biking, rock climbing, or canoeing? Or perhaps you'd prefer to relax in the sauna at your nature house? Or perhaps you'd prefer a combination of activity and relaxation? We've compiled some great tips for your weekend getaway.
              </p>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">An active weekend away</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Some people find peace and quiet with an active weekend getaway. Some enjoy a hiking holiday in nature, while others prefer to explore by bike. Most nature reserves near your nature house offer numerous hiking and cycling routes, making it easy to get away for a weekend or longer.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    You can often find many cycling and walking routes online, but you can also often find them at local tourist information points and centers. A bike ride or walk is guaranteed to completely unwind.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    For true adventurers, there are plenty of opportunities, including horseback riding, mountain biking, rock climbing, and canoeing. Perhaps you'll even try your hand at watersports on the beach, such as surfing or waterskiing. For active weekend getaways, the <a href="#" className="text-purple-600 hover:underline">Ardennes</a>, <a href="#" className="text-purple-600 hover:underline">Limburg</a>, and <a href="#" className="text-purple-600 hover:underline">South Limburg</a> are ideal.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Relax with a wellness weekend away</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    What could be better than relaxing with a wellness weekend? Enjoy a wonderful massage, a sauna session, or simply soak up the peace and quiet. A wellness weekend getaway is the perfect way to unwind and escape the daily grind. Your body and mind are pampered without the overload of external stimuli. It's a healthy and wonderful way to spend a weekend. It's also perfect for a romantic getaway for two. Visit a wellness center from your accommodation, or book a luxury accommodation with a sauna, jacuzzi, or swimming pool included. A truly luxurious weekend getaway!
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Blow out during a weekend at the beach</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    A breath of fresh air on the beach is incredibly beneficial for your peace of mind. Enjoy the views, breathe in the sea air, with nothing but the sound of the waves in the background.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    At Natuurhuisje, you'll find a wide selection of cottages on or near the beach. During your weekend at the beach, you can walk straight from your cottage onto the beach. Whichever coast you choose to stay on, you'll always enjoy a lovely walk.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    In Nederland zijn de stranden lang en uitgestrekt, met het groenblauwe water van de Noordzee. Ga je naar Frankrijk, Spanje of Portugal, dan kun je rekenen op een azuurblauwe zee, wilde golven en witte stranden.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    Houd je meer van een actief weekendje weg? Probeer eens een nieuwe watersport, zoals surfen, windsurfen, kitesurfen en waterskiën. Of relax op een strandbedje wanneer de temperatuur hoog genoeg is. Bij Natuurhuisje vind je vele weekendjes weg aan het water door heel Europa.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-3">Een spelletjesavond met de familie</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Een spelletjesavond tijdens je weekend weg kan altijd. Dat is bijvoorbeeld fijn als het weer even niet mee zit. Maar het is natuurlijk altijd leuk om een spelletjesavond te houden. Misschien neem je daar thuis door de dagelijkse sleur wel nooit tijd voor en kan je hier nu eindelijk eens wat tijd voor vrij maken.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    In vele groepsaccommodaties, bungalows, vakantieboerderijen en bed and breakfasts vind je soms zelfs spellen waarvan je gebruik kunt maken met het hele gezin, maar neem vooral ook je eigen spelletjes mee.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mt-3">
                    Wil je het echt bijzonder maken, huur dan eens een accommodatie met een gehele spelletjeskamer in het huis. Perfect voor een weekendje weg in de winter. Een spelletjesactiviteit hoeft zich overigens niet te beperken tot de accommodatie. Tegenwoordig zijn er tal van spellen om je aan te wagen buiten de accommodatie. Denk eens aan escaperoom. Wie daarentegen liever wat tijd doorbrengt in de natuur, maar dit wil combineren met een spel kan zich wagen aan geocaching. Met behulp van een wandel GPS of je smartphone ga je op zoek naar een schat verborgen in de natuur. Een actief weekend weg was nog nooit zo leuk!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 flex justify-center px-4 md:px-6 lg:px-8">
        <section className={`w-full max-w-5xl py-20 px-10 bg-cream border border-gray-200 rounded-xl shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Discover even more idyllic spots in nature.
          </h2>
          <form className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <input
              type="text"
              placeholder="Your first name"
              className="px-5 py-3 rounded-lg bg-gray-100/70 border border-gray-200 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 w-full sm:w-auto flex-1 transition-all outline-none hover:bg-gray-100 hover:shadow-sm"
            />
            <input
              type="email"
              placeholder="Your email address"
              className="px-5 py-3 rounded-lg bg-gray-100/70 border border-gray-200 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 w-full sm:w-auto flex-1 transition-all outline-none hover:bg-gray-100 hover:shadow-sm"
            />
            <button type="submit" className="px-7 py-3 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all shadow-sm hover:shadow-md hover:scale-105 whitespace-nowrap w-full sm:w-auto">
              Subscribe to newsletter
            </button>
          </form>
          <div className={`flex items-center justify-center gap-2 mt-5 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <input type="checkbox" id="privacy-final" className="rounded border-gray-300 text-violet-600 shadow-sm focus:ring-violet-500 transition-all" />
            <label htmlFor="privacy-final" className="text-sm text-gray-600">
              I agree to the privacy policy
            </label>
          </div>
        </div>
      </section>
      </div>
    </section>
  );
}
