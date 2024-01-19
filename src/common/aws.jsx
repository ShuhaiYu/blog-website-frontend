import axios from 'axios';

export const uploadImage = async (img) => {

    let imgUrl = null;
    // console.log(img);

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then( async ({data : {uploadURL}}) => {
        console.log(uploadURL);
        await axios({
            method: "PUT",
            url: uploadURL,
            data: img,
            headers: {
                "Content-Type": "image/jpeg"
            }
        })
        .then(() => {
            imgUrl = uploadURL.split("?")[0];
        })
    })
    .catch(err => {
        console.log(err);
    })

    return imgUrl;
}