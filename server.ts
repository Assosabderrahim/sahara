import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Data for the cities
  const cities = [
    {
      id: "laayoune",
      name: "العيون",
      description: "كبرى مدن الصحراء المغربية، تتميز بساحة المشور الشهيرة وبنيتها التحتية المتطورة.",
      history: "تأسست المدينة في عام 1938 وشهدت تطوراً هائلاً منذ المسيرة الخضراء عام 1975.",
      landmarks: ["ساحة المشور", "مجمع الصناعة التقليدية", "فم الواد"],
      coordinates: { x: 30, y: 40 },
      image: "https://picsum.photos/seed/laayoune/800/600"
    },
    {
      id: "dakhla",
      name: "الداخلة",
      description: "لؤلؤة الجنوب، تقع على شبه جزيرة وادي الذهب، وهي وجهة عالمية للرياضات البحرية.",
      history: "كانت تعرف تاريخياً بفيلا ثيسنيروس، وهي اليوم قطب سياحي واقتصادي رائد.",
      landmarks: ["خليج الداخلة", "جزيرة التنين", "السبخة"],
      coordinates: { x: 15, y: 80 },
      image: "https://picsum.photos/seed/dakhla/800/600"
    },
    {
      id: "smara",
      name: "السمارة",
      description: "العاصمة الروحية والعلمية للأقاليم الجنوبية، تشتهر بزواياها ومساجدها التاريخية.",
      history: "أسسها الشيخ ماء العينين في أواخر القرن التاسع عشر كمركز للمقاومة والعلم.",
      landmarks: ["زاوية الشيخ ماء العينين", "المسجد العتيق"],
      coordinates: { x: 50, y: 45 },
      image: "https://picsum.photos/seed/smara/800/600"
    },
    {
      id: "boujdour",
      name: "بوجدور",
      description: "مدينة التحدي، تتميز بمنارتها الشهيرة وشواطئها الخلابة.",
      history: "ارتبط اسمها برأس بوجدور الذي كان يشكل تحدياً للملاحين القدامى.",
      landmarks: ["منارة بوجدور", "كورنيش المدينة"],
      coordinates: { x: 20, y: 60 },
      image: "https://picsum.photos/seed/boujdour/800/600"
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "في أي سنة انطلقت المسيرة الخضراء المظفرة؟",
      options: ["1970", "1975", "1980", "1965"],
      correctAnswer: "1975"
    },
    {
      id: 2,
      question: "ما هي المدينة التي تسمى 'لؤلؤة الجنوب'؟",
      options: ["العيون", "السمارة", "الداخلة", "بوجدور"],
      correctAnswer: "الداخلة"
    },
    {
      id: 3,
      question: "من هو مؤسس مدينة السمارة؟",
      options: ["الشيخ ماء العينين", "يوسف بن تاشفين", "أحمد المنصور الذهبي", "مولاي إسماعيل"],
      correctAnswer: "الشيخ ماء العينين"
    }
  ];

  // API Routes
  app.get("/api/cities", (req, res) => {
    res.json(cities);
  });

  app.get("/api/quiz", (req, res) => {
    res.json(quizQuestions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
