export function audioVideoFileFilter(req: Request, file: Express.Multer.File, callback: any) {
    // Extensões comuns de áudio e vídeo
    const allowedExtensions = /\.(mp3|wav|mp4|avi)$/;

    if (!file.originalname.match(allowedExtensions)) {
        return callback(new Error('Apenas arquivos de áudio ou vídeo são permitidos!'), false);
    }

    callback(null, true);
}

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|JPG)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export function pngFileFilter(req: Request, file: Express.Multer.File, callback: any) {
    if (!file.originalname.match(/\.(png)$/)) {
        return callback(new Error('Somente imagens no formato png são permitidos!'), false);
    }
    callback(null, true);
}