import * as fs from 'fs';
import * as env from 'dotenv';
import pdf = require('html-pdf');
import { Injectable } from '@nestjs/common';
import { k500Error } from '../constants/misc';
import { Storage } from '@google-cloud/storage';
import { kMediaImages } from '../constants/directories';

env.config();

@Injectable()
export class FileService {

  async uploadFile(
    filePath: string,
    folderName?: string,
    extension?: string,
    fileName?: string,
  ): Promise<any> {
    try {
      const bufferData = await this.getBuffer(filePath);
      const url = await new Promise(async (resolve) => {
        const storage = new Storage({
          projectId: process.env.CLOUD_PROJECT_NAME,
        });
        const bucket = await storage.bucket(process.env.CLOUD_BUCKET_NAME);
        let nameData: string = Date.now().toString();
        nameData = nameData.concat('.');
        nameData = nameData.concat(extension ?? 'pdf');
        const file = bucket.file(
          (folderName ?? kMediaImages) + '/' + (fileName ?? nameData),
        );
        file.save(
          bufferData,
          { public: true, validation: 'md5' },
          function (error) {
            if (error) resolve({});
            else resolve({ url: file.publicUrl() });
          },
        );
      });
      await this.removeFile(filePath);
      if (!url) return '500';
      return url['url'];
    } catch (error) {
      await this.removeFile(filePath);
      return '500';
    }
  }

  // async urlToBuffer(url: string) {
  //   try {
  //     const options = { responseType: 'arraybuffer' };
  //     const data = await this.api.get(url, {}, {}, { ...options });
  //     if (!data || data == k500Error) return data;
  //     const filePath = './upload/' + new Date().getTime() + '.jpg';
  //     const bufferData = Buffer.from(data, 'binary');
  //     await fs.writeFileSync(filePath, bufferData, 'base64');
  //     const base64Data = fs.readFileSync(filePath, 'base64');
  //     await this.removeFile(filePath);
  //     return base64Data;
  //   } catch (error) {
  //     return k500Error;
  //   }
  // }

  async dataToPDF(content: any) {
    try {
      const options = {
        format: 'A4',
        margin: { top: '40px', bottom: '40px' },
        preferCSSPageSize: true,
      };
      const filePath = './upload/' + new Date().getTime() + '.pdf';
      return await new Promise((resolve, reject) => {
        pdf.create(content, options).toFile(filePath, function (error, data) {
          if (error) reject(k500Error);
          else if (data.filename) resolve(filePath);
          reject(k500Error);
        });
      });
    } catch (error) {
      return k500Error;
    }
  }

  // async mergeMultiplePDF(nextPages: string[], currentPage) {
  //   try {
  //     const cover = await PDFDocument.load(fs.readFileSync(currentPage));
  //     const doc = await PDFDocument.create();

  //     const coverPages = await doc.copyPages(cover, cover.getPageIndices());
  //     for (const page of coverPages) doc.addPage(page);

  //     for (let index = 0; index < nextPages.length; index++) {
  //       const imageURL = 'https://storage.googleapis.co';
  //       let targetPage = nextPages[index];

  //       if (index < nextPages.length - 1) {
  //         const nextPage = nextPages[index + 1];
  //         const nextPageHasImage = nextPage.startsWith(imageURL);
  //         if (nextPageHasImage) continue;
  //       }

  //       let isNetWorkImage = false;
  //       isNetWorkImage = targetPage.startsWith(imageURL);
  //       if (isNetWorkImage == true && index != 0)
  //         targetPage = nextPages[index - 1];
  //       let content = await PDFDocument.load(fs.readFileSync(targetPage));

  //       //Image insertion
  //       let imagePath;
  //       if (isNetWorkImage == true) {
  //         const bufferData = await this.urlToBuffer(nextPages[index]);

  //         const img = await content.embedJpg(bufferData);
  //         const imagePage = content.insertPage(1);
  //         imagePage.drawImage(img, {
  //           x: 0,
  //           y: 0,
  //           width: imagePage.getWidth(),
  //           height: imagePage.getHeight(),
  //         });
  //         imagePath = './upload/' + new Date().getTime() + '.pdf';
  //         await fs.writeFileSync(imagePath, await content.save());
  //         content = await PDFDocument.load(fs.readFileSync(imagePath));
  //       }
  //       //PDF merge
  //       const pageIndices = content.getPageIndices();
  //       const contentPages = await doc.copyPages(content, pageIndices);
  //       for (const page of contentPages) doc.addPage(page);

  //       if (imagePath) await this.removeFile(imagePath);
  //     }

  //     const pdfPath1 = './upload/' + Date.now() + '.pdf';
  //     fs.writeFileSync(pdfPath1, await doc.save());
  //     return pdfPath1;
  //   } catch (error) {
  //     return k500Error;
  //   }
  // }

  private async getBuffer(filePath: string) {
    try {
      if (filePath) return fs.readFileSync(filePath);
      return '500';
    } catch (error) {
      return '500';
    }
  }

  async removeFile(filePath: string) {
    try {
      if (filePath) await fs.unlinkSync(filePath);
    } catch (error) {
      return '500';
    }
  }

  async removeFiles(filePaths: string[]) {
    try {
      for (let index = 0; index < filePaths.length; index++) {
        try {
          const filePath = filePaths[index];
          if (filePath) await fs.unlinkSync(filePath);
        } catch (error) {}
      }
    } catch (error) {
      return k500Error;
    }
  }
}
