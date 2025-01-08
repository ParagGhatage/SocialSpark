import DBconnect from "@/components/DB_connect";

export async function POST(req, res) {
  try {
    // Connect to the database
    const db = await DBconnect();
    const collection = db.collection("social");

    // Get the content type from the request body
    const { type } = await req.json();
    console.log("Selected Content Type:", type);

    // Query all data
    const cursor = await collection.find({});

    // Initialize variables to accumulate totals
    let totalComments = 0;
    let totalShares = 0;
    let totalLikes = 0;
    let totalCount = 0;

    // Initialize variables for each post type
    let staticComments = 0;
    let staticShares = 0;
    let staticLikes = 0;
    let staticCount = 0;

    let carouselComments = 0;
    let carouselShares = 0;
    let carouselLikes = 0;
    let carouselCount = 0;

    let reelsComments = 0;
    let reelsShares = 0;
    let reelsLikes = 0;
    let reelsCount = 0;

    // Iterate through the cursor and calculate totals for each post type
    await cursor.forEach((doc) => {
      totalComments += parseInt(doc.Comments);
      totalShares += parseInt(doc.Shares);
      totalLikes += parseInt(doc.Likes);
      totalCount++;

      // Calculate totals for Static posts
      if (doc.PostType === "Static") {
        staticComments += parseInt(doc.Comments);
        staticShares += parseInt(doc.Shares);
        staticLikes += parseInt(doc.Likes);
        staticCount++;
      }

      // Calculate totals for Carousel posts
      if (doc.PostType === "Carousel") {
        carouselComments += parseInt(doc.Comments);
        carouselShares += parseInt(doc.Shares);
        carouselLikes += parseInt(doc.Likes);
        carouselCount++;
      }

      // Calculate totals for Reels posts
      if (doc.PostType === "Reels") {
        reelsComments += parseInt(doc.Comments);
        reelsShares += parseInt(doc.Shares);
        reelsLikes += parseInt(doc.Likes);
        reelsCount++;
      }
    });

    // Calculate averages for each category
    const avgComments = totalComments / totalCount;
    const avgShares = totalShares / totalCount;
    const avgLikes = totalLikes / totalCount;

    const avgStaticComments = staticCount > 0 ? staticComments / staticCount : 0;
    const avgStaticShares = staticCount > 0 ? staticShares / staticCount : 0;
    const avgStaticLikes = staticCount > 0 ? staticLikes / staticCount : 0;

    const avgCarouselComments = carouselCount > 0 ? carouselComments / carouselCount : 0;
    const avgCarouselShares = carouselCount > 0 ? carouselShares / carouselCount : 0;
    const avgCarouselLikes = carouselCount > 0 ? carouselLikes / carouselCount : 0;

    const avgReelsComments = reelsCount > 0 ? reelsComments / reelsCount : 0;
    const avgReelsShares = reelsCount > 0 ? reelsShares / reelsCount : 0;
    const avgReelsLikes = reelsCount > 0 ? reelsLikes / reelsCount : 0;

    // Round off the averages to the nearest integer
    const round = (value) => Math.round(value);

    const roundedAvgComments = round(avgComments);
    const roundedAvgShares = round(avgShares);
    const roundedAvgLikes = round(avgLikes);

    const roundedAvgStaticComments = round(avgStaticComments);
    const roundedAvgStaticShares = round(avgStaticShares);
    const roundedAvgStaticLikes = round(avgStaticLikes);

    const roundedAvgCarouselComments = round(avgCarouselComments);
    const roundedAvgCarouselShares = round(avgCarouselShares);
    const roundedAvgCarouselLikes = round(avgCarouselLikes);

    const roundedAvgReelsComments = round(avgReelsComments);
    const roundedAvgReelsShares = round(avgReelsShares);
    const roundedAvgReelsLikes = round(avgReelsLikes);

    // Calculate the average for the selected post type
    let selectedAvgComments, selectedAvgShares, selectedAvgLikes;

    if (type === "Static") {
      selectedAvgComments = roundedAvgStaticComments;
      selectedAvgShares = roundedAvgStaticShares;
      selectedAvgLikes = roundedAvgStaticLikes;
    } else if (type === "Carousel") {
      selectedAvgComments = roundedAvgCarouselComments;
      selectedAvgShares = roundedAvgCarouselShares;
      selectedAvgLikes = roundedAvgCarouselLikes;
    } else if (type === "Reels") {
      selectedAvgComments = roundedAvgReelsComments;
      selectedAvgShares = roundedAvgReelsShares;
      selectedAvgLikes = roundedAvgReelsLikes;
    }

    // Return the averages to the frontend
    return Response.json({
      message: "Data fetched successfully",
      averages: {
        total: {
          comments: roundedAvgComments,
          shares: roundedAvgShares,
          likes: roundedAvgLikes,
        },
        static: {
          comments: roundedAvgStaticComments,
          shares: roundedAvgStaticShares,
          likes: roundedAvgStaticLikes,
        },
        carousel: {
          comments: roundedAvgCarouselComments,
          shares: roundedAvgCarouselShares,
          likes: roundedAvgCarouselLikes,
        },
        reels: {
          comments: roundedAvgReelsComments,
          shares: roundedAvgReelsShares,
          likes: roundedAvgReelsLikes,
        },
        selected: {
          Type:type,
          comments: selectedAvgComments,
          shares: selectedAvgShares,
          likes: selectedAvgLikes,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Failed to fetch data" });
  }
}
