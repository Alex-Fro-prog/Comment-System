interface Comment {
    id: number;
    body: string;
    time: number;
    replies: Comment[];
    parentId: number | null;
    avatar: string;
    name: string;
    isFavorite: boolean;
    rating: number;
}

class CommentApp {
    private commentCount: HTMLElement;
    private comments: Comment[];
    private maxCommentLength: number;
    private commentBody: HTMLInputElement;
    private charCount: HTMLElement;
    private charWarning: HTMLElement;
    private commentSend: HTMLButtonElement;
    private replyToId: number | null;
    private userAvatar: HTMLImageElement;
    private userName: HTMLElement;
    private currentUser: { avatar: string, name: string };
    private sortAscending: boolean;
    private showFavoritesOnly: boolean;

    constructor() {
        this.commentCount = document.getElementById('comment-count') as HTMLElement;
        this.comments = [];
        this.maxCommentLength = 1000;
        this.loadComments();
        this.commentBody = document.getElementById('comment-body') as HTMLInputElement;
        this.charCount = document.getElementById('char-count') as HTMLElement;
        this.charWarning = document.getElementById('char-warning') as HTMLElement;
        this.commentSend = document.getElementById('comment-send') as HTMLButtonElement;
        this.replyToId = null;
        this.userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
        this.userName = document.getElementById('user-name') as HTMLElement;
        this.currentUser = { avatar: '', name: '' };
        this.sortAscending = true;
        this.showFavoritesOnly = false;

        this.commentBody.addEventListener('input', () => this.updateCharCount());
        this.commentSend.addEventListener('click', (e) => this.handleSendComment(e));

        const showFavoritesButton = document.getElementById('show-favorites') as HTMLButtonElement;
        showFavoritesButton.addEventListener('click', () => this.toggleShowFavorites());

        this.updateCharCount();
        this.initUser();
    }

    private updateCharCount(): void {
        const length = this.commentBody.value.length;
        this.charCount.textContent = `${length}/${this.maxCommentLength}`;

        if (length === 0 || length > this.maxCommentLength) {
            this.commentSend.disabled = true;
            if (length > this.maxCommentLength) {
                this.charWarning.style.display = 'block';
            } else {
                this.charWarning.style.display = 'none';
            }
        } else {
            this.commentSend.disabled = false;
            this.charWarning.style.display = 'none';
        }
    }

    private async handleSendComment(e: Event): Promise<void> {
        e.preventDefault();
        const commentText = this.commentBody.value;

        if (commentText.length === 0 || commentText.length > this.maxCommentLength) {
            return;
        }

        const comment: Comment = {
            id: Date.now(),
            body: commentText,
            time: Date.now() / 1000,
            replies: [],
            parentId: this.replyToId,
            avatar: this.currentUser.avatar,
            name: this.currentUser.name,
            isFavorite: false,
            rating: 0
        };

        if (this.replyToId !== null) {
            this.addReply(comment);
        } else {
            this.comments.push(comment);
        }

        this.commentBody.value = '';
        this.saveComments();
        this.showComments();
        this.updateCharCount();
        this.updateCommentCount();
        this.replyToId = null;

        this.initUser();
    }

    private addReply(reply: Comment): void {
        const findAndAddReply = (comments: Comment[], parentId: number): boolean => {
            for (const comment of comments) {
                if (comment.id === parentId) {
                    comment.replies.push(reply);
                    return true;
                }
                if (comment.replies.length > 0) {
                    if (findAndAddReply(comment.replies, parentId)) {
                        return true;
                    }
                }
            }
            return false;
        };

        findAndAddReply(this.comments, this.replyToId!);
    }

    private saveComments(): void {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }

    private loadComments(): void {
        const storedComments = localStorage.getItem('comments');
        if (storedComments) {
            this.comments = JSON.parse(storedComments);
        }
        this.sortComments('default');
        this.showComments();
        this.updateCommentCount();
    }

    public sortComments(criteria: string): void {
        if (criteria === 'rating') {
            this.comments.sort((a, b) => this.sortAscending ? a.rating - b.rating : b.rating - a.rating);
        } else if (criteria === 'replies') {
            this.comments.sort((a, b) => this.sortAscending ? a.replies.length - b.replies.length : b.replies.length - a.replies.length);
        } else {
            this.comments.sort((a, b) => this.sortAscending ? a.time - b.time : b.time - a.time);
        }
        this.saveComments();
        this.showComments();
    }

    public toggleSortDirection(): void {
        this.sortAscending = !this.sortAscending;
        const button = document.getElementById('sort-direction') as HTMLButtonElement;
        const sortIcon = document.getElementById('sort-icon') as HTMLElement;

        if (this.sortAscending) {
            sortIcon.innerHTML = '<path opacity="0.4" d="M9 0L0.339746 15L17.6603 15L9 0Z" fill="black"/>';
        } else {
            sortIcon.innerHTML = '<path opacity="0.4" d="M9 15L17.6603 0H0.339746L9 15Z" fill="black"/>';
        }

        const sortSelect = document.getElementById('sort-comments') as HTMLSelectElement;
        this.sortComments(sortSelect.value);
    }

    private showComments(): void {
        const commentField = document.getElementById('comment-field') as HTMLElement;
        if (this.showFavoritesOnly) {
            const favoriteComments = this.filterFavoriteComments(this.comments);
            commentField.innerHTML = this.generateCommentHtml(favoriteComments);
        } else {
            commentField.innerHTML = this.generateCommentHtml(this.comments);
        }
    }

    private generateCommentHtml(comments: Comment[]): string {
        let out = '';
        comments.forEach((item) => {
            const ratingClass = item.rating >= 0 ? 'positive-rating' : 'negative-rating';

            out += `<div class="comment">
                        <img src="${item.avatar}" alt="avatar" class="comment-avatar">
                        <div class="comment-content">
                            <div class="comment-header">
                                <p class="comment-name">${item.name}</p>
                                <p class="time-on-screen">${this.timeConverter(item.time)}</p>
                            </div>
                            <p class="message-on-screen">${item.body}</p>`;
            if (item.parentId === null) {
                out += `<div class="comment-actions">
                            <p class="reply-button" onclick="app.replyTo(${item.id})">
                                <svg class="arrow-icon" width="22" height="22" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.004 2.98l-6.99 4.995 6.99 4.977V9.97c1.541-.097 2.921-.413 7.01 3.011-1.34-4.062-3.158-6.526-7.01-7.001v-3z" fill="#9D9D9D"></path>
                                </svg>Ответить
                            </p>
                            <p class="favorite-button ${item.isFavorite ? 'active' : ''}" onclick="app.toggleFavorite(${item.id})">
                                <svg class="favorite-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <mask id="mask0_12_617" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="url(#pattern0_12_617)" />
                                    </mask>
                                    <g mask="url(#mask0_12_617)">
                                        <rect opacity="0.4" x="2" y="4" width="21" height="19" fill="black" />
                                        <path class="heart-empty" d="M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z" fill="white" />
                                        <path class="heart-filled" d="M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z" fill="#9D9D9D" />
                                    </g>
                                    <defs>
                                        <pattern id="pattern0_12_617" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_12_617" transform="scale(0.0104167)" />
                                        </pattern>
                                        <image id="image0_12_617" width="96" height="96" xlink:href="data:image/png;base64,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" />
                                    </defs>
                                </svg>${item.isFavorite ? 'В избранном' : 'В избранное'}
                            </p>
                            <div class="rating">
                                <p class="rating-button" onclick="app.changeRating(${item.id}, -1)"><svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                <path d="M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z" fill="#FF0000"/>
                                </svg></p>
                                <span class="rating-value ${ratingClass}">${item.rating}</span>
                                <p class="rating-button" onclick="app.changeRating(${item.id}, 1)"><svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                <path d="M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z" fill="#8AC540"/>
                                </svg></p>
                            </div>
                        </div>`;
            } else {
                out += `<div class="comment-actions">
                            <p class="favorite-button ${item.isFavorite ? 'active' : ''}" onclick="app.toggleFavorite(${item.id})">
                                <svg class="favorite-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <mask id="mask0_12_617" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="url(#pattern0_12_617)" />
                                    </mask>
                                    <g mask="url(#mask0_12_617)">
                                    <rect opacity="0.4" x="2" y="4" width="21" height="19" fill="black" />
                                    <path class="heart-empty" d="M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z" fill="white" />
                                    <path class="heart-filled" d="M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z" fill="#9D9D9D" />
                                    </g>
                                    <defs>
                                    <pattern id="pattern0_12_617" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlink:href="#image0_12_617" transform="scale(0.0104167)" />
                                    </pattern>
                                    <image id="image0_12_617" width="96" height="96" xlink:href="data:image/png;base64,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" />
                                    </defs>
                                </svg>${item.isFavorite ? 'В избранном' : 'В избранное'}
                            </p>
                            <div class="rating">
                                <p class="rating-button" onclick="app.changeRating(${item.id}, -1)"><svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                <path d="M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z" fill="#FF0000"/>
                                </svg></p>
                                <span class="rating-value ${ratingClass}">${item.rating}</span>
                                <p class="rating-button" onclick="app.changeRating(${item.id}, 1)"><svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                <path d="M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z" fill="#8AC540"/>
                                </svg></p>
                            </div>
                        </div>`;
            }
            if (item.replies.length > 0) {
                out += this.generateCommentHtml(item.replies);
            }
            out += `</div></div>`;
        });
        return out;
    }
    

    private timeConverter(UNIX_timestamp: number): string {
        const a = new Date(UNIX_timestamp * 1000);
        const year = a.getFullYear();
        const month = ('0' + (a.getMonth() + 1)).slice(-2);
        const date = ('0' + a.getDate()).slice(-2);
        const hour = ('0' + a.getHours()).slice(-2);
        const min = ('0' + a.getMinutes()).slice(-2);
        const sec = ('0' + a.getSeconds()).slice(-2);
        return `${date}.${month}.${year} ${hour}:${min}:${sec}`;
    }

    private async initUser(): Promise<void> {
        const user = await this.fetchRandomUser();
        this.currentUser.avatar = user.picture.thumbnail;
        this.currentUser.name = `${user.name.first} ${user.name.last}`;
        this.userAvatar.src = this.currentUser.avatar;
        this.userName.textContent = this.currentUser.name;
    }

    private async fetchRandomUser(): Promise<any> {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        return data.results[0];
    }

    private updateCommentCount(): void {
        const count = this.countReplies(this.comments);
        this.commentCount.textContent = `Комментарии (${count})`;
    }

    private countReplies(comments: Comment[]): number {
        let count = comments.length;
        comments.forEach((comment) => {
            if (comment.replies.length > 0) {
                count += this.countReplies(comment.replies);
            }
        });
        return count;
    }

    private changeRating(commentId: number, change: number): void {
        const updateRating = (comments: Comment[]): boolean => {
            for (const comment of comments) {
                if (comment.id === commentId) {
                    comment.rating += change;
                    return true;
                }
                if (comment.replies.length > 0) {
                    if (updateRating(comment.replies)) {
                        return true;
                    }
                }
            }
            return false;
        };

        updateRating(this.comments);
        this.saveComments();
        this.showComments();
    }

    public replyTo(id: number): void {
        this.replyToId = id;
        this.commentBody.focus();
    }

    public toggleFavorite(id: number): void {
        const toggleFavoriteStatus = (comments: Comment[]): boolean => {
            for (const comment of comments) {
                if (comment.id === id) {
                    comment.isFavorite = !comment.isFavorite;
                    return true;
                }
                if (comment.replies.length > 0) {
                    if (toggleFavoriteStatus(comment.replies)) {
                        return true;
                    }
                }
            }
            return false;
        };

        toggleFavoriteStatus(this.comments);
        this.saveComments();
        this.showComments();
    }

    public toggleShowFavorites(): void {
        this.showFavoritesOnly = !this.showFavoritesOnly;
        this.showComments();
    }

    private filterFavoriteComments(comments: Comment[]): Comment[] {
        return comments.filter(comment => comment.isFavorite || comment.replies.some(reply => reply.isFavorite));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    (window as any).app = new CommentApp();
});