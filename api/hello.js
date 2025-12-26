module.exports = (req, res) => {
  const YOUR_NAME = "Paras Chourasiya";
  
  res.json({
    message: `Hello from ${YOUR_NAME}'s Vercel API!`,
    timestamp: new Date().toISOString(),
    endpoints: {
      scrape: "/api/scrape?url=YOUR_URL",
      github: "/api/github?username=Aotpy"
    },
    note: "do not replace anything"
  });
};
