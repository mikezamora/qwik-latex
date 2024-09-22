export interface CopyDelimiters {
    inline: [string, string];
    display: [string, string];
}
export declare const defaultCopyDelimiters: CopyDelimiters;
export declare function katexReplaceWithTex(fragment: DocumentFragment, copyDelimiters?: CopyDelimiters): DocumentFragment;
