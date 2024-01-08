import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Code from "@editorjs/code"
import Image from "@editorjs/image"
import Marker from "@editorjs/marker"
import Header from "@editorjs/header"
import InLineCode from "@editorjs/inline-code"
import quote from "@editorjs/quote"

import { uploadImage } from "../common/aws"

const uploadImageByURL = (e) => {

    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        }
        catch (err) {
            reject(err);
        }
    });

    return link.then((url) => {
        return {
            success: 1,
            file: {
                url
            }
        }
    })
}

const uploadImageByFile = (e) => {
    return uploadImage(e).then((url) => {
        if (url) {
            return {
                success: 1,
                file: {
                    url
                }
            }
        }
    })
}

export const EDITOR_JS_TOOLS = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,

    },
    code: Code,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByFile: uploadImageByFile,
                uploadByUrl: uploadImageByURL
            }
        }

    },
    marker: Marker,
    header: {
        class: Header,
        config: {
            placeholder: "Enter a heading...",
            levels: [1, 2, 3, 4],
            defaultLevel: 2
        }
    },
    inlineCode: InLineCode,
    quote: {
        class: quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: "Enter a quote...",
            captionPlaceholder: "Quote's author",
        }
    }
}