module.exports = (req, res) => {
  const YOUR_NAME = "YOUR_NAME";
  
  res.json({
    message: `Hello from ${YOUR_NAME}'s Vercel API!`,
    timestamp: new Date().toISOString(),
    endpoints: {
      scrape: "/api/scrape?url=YOUR_URL",
      github: "/api/github?username=USERNAME"
    },
    note: "Replace YOUR_NAME with your actual name in the code"
  });
};
