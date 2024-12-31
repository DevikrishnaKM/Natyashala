
const getFolderPathByFileType = (fileType: string): string => {
    switch (fileType) {
        case 'idProof':
            return 'tutorApplication/idProofs';
        case 'resume':
            return 'tutorApplication/resume';
        case 'certification':
            return 'tutorApplication/certifications';
        default:
            throw new Error(`Unknown file type: ${fileType}`);
    }
}

export default getFolderPathByFileType;
