export const LoadJs = (url: string, callback?: any) => {
    let domScript: any = document.createElement('script');
    domScript.src = url;
    let success = callback || function () { };
    domScript.onload = domScript.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript);
}