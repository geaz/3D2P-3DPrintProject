import * as React from "react";
import * as marked from "marked";
import { useState, FC, useEffect } from "react";

interface MarkdownComponentProps {
    markdownUrl: string;
}

export const MarkdownComponent: FC<MarkdownComponentProps> = (props: MarkdownComponentProps) => {
    const [isLoading, setLoading] = useState(false);
    const [markdown, setMarkdown] = useState("");

    async function fetchMarkdown(): Promise<void> {
        setLoading(true);
        let response = await fetch(props.markdownUrl);
        let fileContent = await response.text();
        setMarkdown(marked(fileContent));
        setLoading(false);
    };
    useEffect(() => { fetchMarkdown(); }, [props.markdownUrl]);

    return <div>
        {isLoading && <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> }
        {!isLoading && <div className="markdown" dangerouslySetInnerHTML={{ __html: markdown }}></div> }
    </div>;
};
