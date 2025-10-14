export default function ReviewsPage() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-6 pb-20" id="reviews">
          <h2 className="text-2xl font-semibold mb-2 text-right text-white">
            <Link href="/articles/reviews" className="hover:underline">
              In-Depth Automotive Video Reviews
            </Link>
          </h2>
          <div className="flex gap-x-5">
            <div className="w-1/2">
              <hr className="border-gray-400 bg-white w-full" />
              <div className="flex gap-x-5 p-4 h-48">
              {/* Text block takes 70% */}
              <div className="flex flex-col justify-between text-right w-[70%]">
                <h3 className="text-white font-bold">{articles[0].title}</h3>
                <p className="text-white line-clamp-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
                  reprehenderit ad earum accusantium, quia similique dolores modi,
                  cumque quas ullam dolore, hic magni?
                </p>
                <p className="text-white">
                  by <span className="font-bold text-white">Author</span>
                </p>
              </div>

              {/* Image container takes 30% */}
              <div className="w-[30%] h-full shadow-md rounded-lg overflow-hidden">
                <img
                  src={articles[2].image}
                  alt={articles[1].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex gap-x-5 p-4 h-48">
            {/* Text block takes 70% */}
            <div className="flex flex-col justify-between text-right w-[70%]">
              <h3 className="text-white font-bold">{articles[0].title}</h3>
              <p className="text-white line-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
                reprehenderit ad earum accusantium, quia similique dolores modi,
                cumque quas ullam dolore, hic magni?
              </p>
              <p className="text-white">
                by <span className="font-bold text-white">Author</span>
              </p>
            </div>

            {/* Image container takes 30% */}
            <div className="w-[30%] h-full shadow-md rounded-lg overflow-hidden">
              <img
                src={articles[2].image}
                alt={articles[1].title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>

          <div className="flex gap-x-5 p-4 h-48">
            {/* Text block takes 70% */}
            <div className="flex flex-col justify-between text-right w-[70%]">
              <h3 className="text-white font-bold">{articles[0].title}</h3>
              <p className="text-white line-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
                reprehenderit ad earum accusantium, quia similique dolores modi,
                cumque quas ullam dolore, hic magni?
              </p>
              <p className="text-white">
                by <span className="font-bold text-white">Author</span>
              </p>
            </div>

            {/* Image container takes 30% */}
            <div className="w-[30%] h-full shadow-md rounded-lg overflow-hidden">
              <img
                src={articles[2].image}
                alt={articles[1].title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>

            </div>
            <div className="w-1/2 text-right">
              <hr className="border-gray-400 mb-4 bg-white w-full" />
              <div className="w-full h-96 shadow-md rounded-lg overflow-hidden mb-4">
                <img 
                  src={articles[2].image}
                  alt={articles[1].title}
                  className="w-full h-full object-cover"/>
              </div>
              <h3 className="text-white font-bold">{articles[0].title}</h3>
              <p className="text-white">
                by <span className="font-bold text-white">Author</span>
              </p>
            </div>
          </div>
      </section>
    )
}