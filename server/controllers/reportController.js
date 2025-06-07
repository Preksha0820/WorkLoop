// import prisma from '../prisma.js';
// import multer from 'multer';

// // File upload setup
// const upload = multer({
//   dest: 'uploads/',
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// export const uploadMiddleware = upload.single('file');

// // Submit report
// export const submitDailyReport = async (req, res) => {
//   const { content, reportDate } = req.body;
//   const userId = req.user.id;

//   if (!content || !reportDate) {
//     return res.status(400).json({ message: 'Please provide content and report date' });
//   }

//   try {
//     const dateStart = new Date(reportDate);
//     dateStart.setHours(0, 0, 0, 0);
//     const dateEnd = new Date(reportDate);
//     dateEnd.setHours(23, 59, 59, 999);

//     // Check if report already exists for this date
//     const existingReport = await prisma.report.findFirst({
//       where: {
//         userId,
//         reportDate: {
//           gte: dateStart,
//           lte: dateEnd,
//         },
//       },
//     });

//     if (existingReport) {
//       return res.status(409).json({ message: 'You already submitted a report for this date' });
//     }

//     let fileURL = null;
//     if (req.file) {
//       fileURL = req.file.path;
//     }

//     const newReport = await prisma.report.create({
//       data: {
//         userId,
//         content,
//         reportDate: new Date(reportDate),
//         fileURL,
//       },
//     });

//     res.status(201).json({ message: 'Report submitted successfully', report: newReport });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error submitting report' });
//   }
// };
