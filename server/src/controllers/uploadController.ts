import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct the URL to the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
};
