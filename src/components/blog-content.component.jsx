const Img = ({ url, caption }) => {
    return (
        <div>
            <img src={url} />
            {
                caption ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p> : ""
            }
        </div>

    )
}

const Quote = ({ quote, caption }) => {
    return (
        <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
            <p className="md:text-2xl text-xl leading-10">{quote}</p>
            {
                caption ? <p className="w-full text-purple text-base">{caption}</p> : ""
            }
        </div>
    )
}

const List = ({ style, items }) => {
    return (
        <ol className={`pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}>
            {
                items.map((item, index) => {
                    return (
                        <li key={index} className="my-4" dangerouslySetInnerHTML={{ __html: item }}></li>
                    )
                })
            }
        </ol>
    )
}

const BlogContent = ({ block }) => {

    let { type, data } = block;

    if (type === "paragraph") {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>
    }
    else if (type === "header") {

        if (data.level === 3) {
            return <h3 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h3>
        }
        else {
            return <h2 className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h2>
        }
    }
    else if (type === "image") {
        return <Img url={data.file.url} caption={data.caption} />
    }

    else if (type === "quote") {
        return <Quote quote={data.text} caption={data.caption}></Quote>
    }

    else if (type === "list") {
        return <List style={data.style} items={data.items} />
    }
    else if (type === "code") {
        return <pre className="bg-dark-grey/10 p-3 pl-5 text-xl" dangerouslySetInnerHTML={{ __html: data.code }}></pre>
    }


    else {
        return <h1> This is a block</h1>;
    }
}

export default BlogContent;