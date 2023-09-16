const fs = require('fs').promises;

const deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log('User Image removed successfully');
    } catch (error) {
        console.error('User Image does not exist');
    }
};


module.exports = deleteImage;
