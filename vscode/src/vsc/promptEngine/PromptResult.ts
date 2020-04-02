export class PromptResult {
    constructor( 
        public message: string | undefined = undefined,        
        public isFaulted: boolean = false
    ) { }
}