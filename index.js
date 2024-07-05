var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CommentApp = /** @class */ (function () {
    function CommentApp() {
        var _this = this;
        this.commentCount = document.getElementById('comment-count');
        this.comments = [];
        this.maxCommentLength = 1000;
        this.loadComments();
        this.commentBody = document.getElementById('comment-body');
        this.charCount = document.getElementById('char-count');
        this.charWarning = document.getElementById('char-warning');
        this.commentSend = document.getElementById('comment-send');
        this.replyToId = null;
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        this.currentUser = { avatar: '', name: '' };
        this.sortAscending = true;
        this.showFavoritesOnly = false;
        this.commentBody.addEventListener('input', function () { return _this.updateCharCount(); });
        this.commentSend.addEventListener('click', function (e) { return _this.handleSendComment(e); });
        var showFavoritesButton = document.getElementById('show-favorites');
        showFavoritesButton.addEventListener('click', function () { return _this.toggleShowFavorites(); });
        this.updateCharCount();
        this.initUser();
    }
    CommentApp.prototype.updateCharCount = function () {
        var length = this.commentBody.value.length;
        this.charCount.textContent = "".concat(length, "/").concat(this.maxCommentLength);
        if (length === 0 || length > this.maxCommentLength) {
            this.commentSend.disabled = true;
            if (length > this.maxCommentLength) {
                this.charWarning.style.display = 'block';
            }
            else {
                this.charWarning.style.display = 'none';
            }
        }
        else {
            this.commentSend.disabled = false;
            this.charWarning.style.display = 'none';
        }
    };
    CommentApp.prototype.handleSendComment = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var commentText, comment;
            return __generator(this, function (_a) {
                e.preventDefault();
                commentText = this.commentBody.value;
                if (commentText.length === 0 || commentText.length > this.maxCommentLength) {
                    return [2 /*return*/];
                }
                comment = {
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
                }
                else {
                    this.comments.push(comment);
                }
                this.commentBody.value = '';
                this.saveComments();
                this.showComments();
                this.updateCharCount();
                this.updateCommentCount();
                this.replyToId = null;
                this.initUser();
                return [2 /*return*/];
            });
        });
    };
    CommentApp.prototype.addReply = function (reply) {
        var findAndAddReply = function (comments, parentId) {
            for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
                var comment = comments_1[_i];
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
        findAndAddReply(this.comments, this.replyToId);
    };
    CommentApp.prototype.saveComments = function () {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    };
    CommentApp.prototype.loadComments = function () {
        var storedComments = localStorage.getItem('comments');
        if (storedComments) {
            this.comments = JSON.parse(storedComments);
        }
        this.sortComments('default');
        this.showComments();
        this.updateCommentCount();
    };
    CommentApp.prototype.sortComments = function (criteria) {
        var _this = this;
        if (criteria === 'rating') {
            this.comments.sort(function (a, b) { return _this.sortAscending ? a.rating - b.rating : b.rating - a.rating; });
        }
        else if (criteria === 'replies') {
            this.comments.sort(function (a, b) { return _this.sortAscending ? a.replies.length - b.replies.length : b.replies.length - a.replies.length; });
        }
        else {
            this.comments.sort(function (a, b) { return _this.sortAscending ? a.time - b.time : b.time - a.time; });
        }
        this.saveComments();
        this.showComments();
    };
    CommentApp.prototype.toggleSortDirection = function () {
        this.sortAscending = !this.sortAscending;
        var button = document.getElementById('sort-direction');
        var sortIcon = document.getElementById('sort-icon');
        if (this.sortAscending) {
            sortIcon.innerHTML = '<path opacity="0.4" d="M9 0L0.339746 15L17.6603 15L9 0Z" fill="black"/>';
        }
        else {
            sortIcon.innerHTML = '<path opacity="0.4" d="M9 15L17.6603 0H0.339746L9 15Z" fill="black"/>';
        }
        var sortSelect = document.getElementById('sort-comments');
        this.sortComments(sortSelect.value);
    };
    CommentApp.prototype.showComments = function () {
        var commentField = document.getElementById('comment-field');
        if (this.showFavoritesOnly) {
            var favoriteComments = this.filterFavoriteComments(this.comments);
            commentField.innerHTML = this.generateCommentHtml(favoriteComments);
        }
        else {
            commentField.innerHTML = this.generateCommentHtml(this.comments);
        }
    };
    CommentApp.prototype.generateCommentHtml = function (comments) {
        var _this = this;
        var out = '';
        comments.forEach(function (item) {
            var ratingClass = item.rating >= 0 ? 'positive-rating' : 'negative-rating';
            out += "<div class=\"comment\">\n                        <img src=\"".concat(item.avatar, "\" alt=\"avatar\" class=\"comment-avatar\">\n                        <div class=\"comment-content\">\n                            <div class=\"comment-header\">\n                                <p class=\"comment-name\">").concat(item.name, "</p>\n                                <p class=\"time-on-screen\">").concat(_this.timeConverter(item.time), "</p>\n                            </div>\n                            <p class=\"message-on-screen\">").concat(item.body, "</p>");
            if (item.parentId === null) {
                out += "<div class=\"comment-actions\">\n                            <p class=\"reply-button\" onclick=\"app.replyTo(".concat(item.id, ")\">\n                                <svg class=\"arrow-icon\" width=\"22\" height=\"22\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\">\n                                    <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8.004 2.98l-6.99 4.995 6.99 4.977V9.97c1.541-.097 2.921-.413 7.01 3.011-1.34-4.062-3.158-6.526-7.01-7.001v-3z\" fill=\"#9D9D9D\"></path>\n                                </svg>\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C\n                            </p>\n                            <p class=\"favorite-button ").concat(item.isFavorite ? 'active' : '', "\" onclick=\"app.toggleFavorite(").concat(item.id, ")\">\n                                <svg class=\"favorite-icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                    <mask id=\"mask0_12_617\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n                                        <rect width=\"24\" height=\"24\" fill=\"url(#pattern0_12_617)\" />\n                                    </mask>\n                                    <g mask=\"url(#mask0_12_617)\">\n                                        <rect opacity=\"0.4\" x=\"2\" y=\"4\" width=\"21\" height=\"19\" fill=\"black\" />\n                                        <path class=\"heart-empty\" d=\"M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z\" fill=\"white\" />\n                                        <path class=\"heart-filled\" d=\"M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z\" fill=\"#9D9D9D\" />\n                                    </g>\n                                    <defs>\n                                        <pattern id=\"pattern0_12_617\" patternContentUnits=\"objectBoundingBox\" width=\"1\" height=\"1\">\n                                            <use xlink:href=\"#image0_12_617\" transform=\"scale(0.0104167)\" />\n                                        </pattern>\n                                        <image id=\"image0_12_617\" width=\"96\" height=\"96\" xlink:href=\"data:image/png;base64,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\" />\n                                    </defs>\n                                </svg>").concat(item.isFavorite ? 'В избранном' : 'В избранное', "\n                            </p>\n                            <div class=\"rating\">\n                                <p class=\"rating-button\" onclick=\"app.changeRating(").concat(item.id, ", -1)\"><svg width=\"20\" height=\"23\" viewBox=\"0 0 20 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle opacity=\"0.1\" cx=\"10\" cy=\"13\" r=\"10\" fill=\"black\"/>\n                                <path d=\"M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z\" fill=\"#FF0000\"/>\n                                </svg></p>\n                                <span class=\"rating-value ").concat(ratingClass, "\">").concat(item.rating, "</span>\n                                <p class=\"rating-button\" onclick=\"app.changeRating(").concat(item.id, ", 1)\"><svg width=\"20\" height=\"23\" viewBox=\"0 0 20 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle opacity=\"0.1\" cx=\"10\" cy=\"13\" r=\"10\" fill=\"black\"/>\n                                <path d=\"M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z\" fill=\"#8AC540\"/>\n                                </svg></p>\n                            </div>\n                        </div>");
            }
            else {
                out += "<div class=\"comment-actions\">\n                            <p class=\"favorite-button ".concat(item.isFavorite ? 'active' : '', "\" onclick=\"app.toggleFavorite(").concat(item.id, ")\">\n                                <svg class=\"favorite-icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                    <mask id=\"mask0_12_617\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n                                    <rect width=\"24\" height=\"24\" fill=\"url(#pattern0_12_617)\" />\n                                    </mask>\n                                    <g mask=\"url(#mask0_12_617)\">\n                                    <rect opacity=\"0.4\" x=\"2\" y=\"4\" width=\"21\" height=\"19\" fill=\"black\" />\n                                    <path class=\"heart-empty\" d=\"M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z\" fill=\"white\" />\n                                    <path class=\"heart-filled\" d=\"M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z\" fill=\"#9D9D9D\" />\n                                    </g>\n                                    <defs>\n                                    <pattern id=\"pattern0_12_617\" patternContentUnits=\"objectBoundingBox\" width=\"1\" height=\"1\">\n                                        <use xlink:href=\"#image0_12_617\" transform=\"scale(0.0104167)\" />\n                                    </pattern>\n                                    <image id=\"image0_12_617\" width=\"96\" height=\"96\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAKSklEQVR4nO2ce5AUxR3Hfz3v2feyu/fAQ+CAoDkFBAOUhocpgsbSIyASH8TCJFaSMmpSMZXEmKoz0aS0UlplJT5QimjKBxINSUAqGiMVkQsiormcJXgcdxx3t+zu7e3jdufdnT+QihqFmd3Zmz3pT9Xvr+3+9W9+3+menp3uBqBQKBQKhUKhUCgUCoVCoVAoFAqFQqHUFFTrBsjyDRHQisuxrlxBDH0msrQoEOABY5YA5hHLjSGGKwInFBEr/BNCvi3oH1sO1ySWi66bB3rhOssy5oChxhC2fIRgARHCAyAVGM4iHJtlODGNeHk7sIHtaM8fUrWI5SQ1EYBAB2MtfvtSoim3kbHR2Sgz0EKKIxyY+qmD8YUBxVtSJBRPguB/hRP9d6POrdmqYlmyvtkoZ3+JtNJClE22kJGBKNHKp66EGIBgDDPxliESjPUhUX6CnSptRlu3WtXE8olNue3QXLhqtaUU74JkTyvKHPMDwZU5kgIEprT1QSC6lw9Hb0G7nsk4qU4WXdto6tmHcGHkC2igewroSmVxAABEmjU4a3YPSP5H+f07fosASOXOPoprAiiLr5mGlJFNKHl4PhzvjbjlFwQJYMaCHuQL3yvsf/Hx0xUnAEid/5U7mLHcN+DIgVYwVNdCgUmTy9DS1kWkwA3SG3865IZLVwRQ519+BSllH0Q9b04Hy3TD5f8TP7tAWmbvluTIWtS59RNvZ7L86oCayz2P+ruWwGhSrkkcDAt4xvyjJBi/x//Wzo3VuqtaAGXeyp+R7OD3mKPdTdX6Oi1SAOPPLdynTQpdFt21Lffhn0pL1jRDLvs39tAb54FWrvnkAjfPHEFNrY/JB176aTV+qgq0NHflnTB08HYm3R+uxo8jeAnM2Yv+DdGGFcHXtqYBAMYWtTfCWP4V5r09bcgyxi0UiE0pGC3nPBZ65+XbK3VRsQD5eSuvZ1P9D7BDBxOV+qgYTgD93C92hmJ46XAxKATV4uvcwdfngTmOyf8A3Dg9S5pm3R1456UHKqlfkQDZ+e1zuNzADq73QEsl9d2A+COG2brgaQIkJLy/dxWoJcarWMypcwdxrGVV5K0d+53WdSwAgQ4m1/bqXuHd1y6seIrpElZsyigiFsNkh8ZvCPwkEAP6ORd3RXznLkD7NzrqhqzTtm49n/052991FdJKnNO6boOUgoyUouR1HAAEkFKYVApK/vtSR152UtNRt01f3B5E5dwNTDEjETjxNkLthKFSjkfl0TXZBVc76o2OBDDzhR8yQ+9P9/pi69XYoYOtppq+y0lObQtAABCjlVcjpcB4faH1aqCWENHKKwh02M6r7YLDF6xcwo4MzvD6IuvdmOzg1OTczmV282r7QYqV8vWokPF7O++pf5h8KoDjYzcAwKt2ytufyRjaeWBqJ7oa5dOxDABLP8ducVtDEIEOhuhqk9fde6IYNrQYsfmOZUuAw3P2xJGu0KmnTWO0UvDY3C9NtpNbW0MQIrgRGaqP2ClMAWKosmHycQAYPF1ZWwJYAI1gqAEqgD2IacgGa4bslLUnAMEMJoSlAtiDABCwkK102RIAY6RghAwCIFQX2pkBZhgdW5atj9A2nwHWKOHEEhXAHpjlVQOzo3bK2hLA5MxBg5dKPEC0utDODCxeLsuYP+0DGMDmNHRO1+5RkxNKXk/vJopZLFec1bNTs5Nb22/CJssdJwCz7ZY/k7FYLmm3rG0BCGLfs1h+KTOeH70nIBYnAkbc23bL2/431OCEv+pSQPe6e9e7mVJIMXhxu9282u4BDPbt1uTosFAanWq3zpmI4gsP47K+z2552z3ggr5dOUOUj2BAnt9ldWsIgcGJhy4c2n+a1b//w9knSY5/XJeDmucXWqemyNGyzgoPO8mpIwH8AWNrOZDo9/pC69WUYKxvYGDmDic5dSRAW3e3rnHiPoPlAQNQ+5AZnAgGw7+2DpztIXC8mkwV/bcXw5NpL/iY5SPNvZgN3+E0n44FuKRvX1KTfLtMlvf8ouvFDE4kBi+/dNGxTse7eSpa3Yax9KN8ePKySLZ/WiX1P2sUIs29hihWtEy9ogWtS5MH0rooP6uJ/jN+RqSJAVVnxc2X9L39kf0Kdql4eXoHALM8MWNvPNN7ISKkUjcTGoIYyCRaO5elei6udN9YxUu6OwCwyoob8qGmQa/vQq8sF24eNHluQzWb9qpaU39Z8t1uhQ88rQh+xetp4HhbWQyVVE7euGLwvao261W9l4oAoJdjM3bGcgMrOUuv+d6sesBieZyJnr19Zebwqmp9Vb2rBAGQHCOtzYTP6saI8XxYqLVZiIFUuKVLEyLXVpu7D/LnDi/EZp0bMEsvxvJD0z7L3SATbulVJf+K9uMHj7jhz9Vc/TkxfamsKE/FxpKe7R2rJdlQ81GV819zZban0y2fjrconYpny7n+df5Ej8lyyySjHHTTt9eM+hsGNUG+6cps7y43/boqAADAM2ru0Ff9iRxmuMWioQS8HrPdsKwvPjzGB76/Ktf3F7fz5boAAABb1PyB1XLjMYPlFstG2dYSvXol60sMlXjfbVfl+/9YC/81fV6+EJp2mWCWH4mVU1Mn4oN5xJcY0Hj5m2vyRx3tfHRCzfOyJTJlqWTqm+OlVOtE+cuCIAbS/obDKiOtv6bQ969atjUuN+ZT4bNbRcvc1lBOnc/iGp2m4hImw5KML9FtsWL7uny/K1PNUzFuI8Nz0dYwNpRtcWXkIsnS63KNqcaKRkaO7Uay0b4unR4bjzbHdWh+FYAb9k/eGNIL7WFjLDaebZ+OvBAcLQiB57mx4e+sA3D9aLJPw5Nn45P+5q9Lln5Pg5qdgir/I9EVCCDISNE+lRU61peST4x3+55NTn4faGoTMH4moWbbeGx6ctKJzvBWRop2EU5Yd33h2PtexODp7HAzTJNYubwxYCqXR43iuA5JBc6fyfP+nTkldNOt0GNrJXMtqIvp+Sa5YbWEzXsTem4WW+MjcCzEQEoIHzEZ7icblPRzNW3MBnUhAADAw4HGBsm0nptkFBf6La0mB+4pjFDOCKE3yyz62s2ltO0l5LWkbgQAOPFxZ5MQ+4Uf6zfGzbGzqvjS9zG/CNJc4JjGCI/cqI/8ys1zP6ulrgQ4ye/4xDwJzE0NZvF8gZh8Nb40xJlpLtitI2H9d/Xj/3ErRreoSwEAAB4F4IGP3u/D+tqEVXJ8JCYBgFHWlywy0vZhI3tzB8Cpz032iLoV4CQPcdElPJCHGq3i53li2Zqu6ojFKTZwUAf2Wzeb2T21jrEa6l4AAIBHYbLPYkubQkT/8iSsnHK6OsLI6SISd6asyLc7oM/Fc4trw4QQ4CQPsuG1MrF+3YBLM9mPPUctQJBkfH064n9wi5Xb5lGIjplQAgAA3AuTWmTW2NKElQUyMUUAAAWxeorxHShZ4pofQ2bI6xidUJMvYrXk76AUFhH9SZPxNVuAppYRX0oj8YlRPHb1nVAueB3fGcX9ELzyN+C/1Os4KBQKhUKhUCgUCoVCoVAoFDv8F6pOyz8OCDukAAAAAElFTkSuQmCC\" />\n                                    </defs>\n                                </svg>").concat(item.isFavorite ? 'В избранном' : 'В избранное', "\n                            </p>\n                            <div class=\"rating\">\n                                <p class=\"rating-button\" onclick=\"app.changeRating(").concat(item.id, ", -1)\"><svg width=\"20\" height=\"23\" viewBox=\"0 0 20 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle opacity=\"0.1\" cx=\"10\" cy=\"13\" r=\"10\" fill=\"black\"/>\n                                <path d=\"M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z\" fill=\"#FF0000\"/>\n                                </svg></p>\n                                <span class=\"rating-value ").concat(ratingClass, "\">").concat(item.rating, "</span>\n                                <p class=\"rating-button\" onclick=\"app.changeRating(").concat(item.id, ", 1)\"><svg width=\"20\" height=\"23\" viewBox=\"0 0 20 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <circle opacity=\"0.1\" cx=\"10\" cy=\"13\" r=\"10\" fill=\"black\"/>\n                                <path d=\"M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z\" fill=\"#8AC540\"/>\n                                </svg></p>\n                            </div>\n                        </div>");
            }
            if (item.replies.length > 0) {
                out += _this.generateCommentHtml(item.replies);
            }
            out += "</div></div>";
        });
        return out;
    };
    CommentApp.prototype.timeConverter = function (UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        var month = ('0' + (a.getMonth() + 1)).slice(-2);
        var date = ('0' + a.getDate()).slice(-2);
        var hour = ('0' + a.getHours()).slice(-2);
        var min = ('0' + a.getMinutes()).slice(-2);
        var sec = ('0' + a.getSeconds()).slice(-2);
        return "".concat(date, ".").concat(month, ".").concat(year, " ").concat(hour, ":").concat(min, ":").concat(sec);
    };
    CommentApp.prototype.initUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchRandomUser()];
                    case 1:
                        user = _a.sent();
                        this.currentUser.avatar = user.picture.thumbnail;
                        this.currentUser.name = "".concat(user.name.first, " ").concat(user.name.last);
                        this.userAvatar.src = this.currentUser.avatar;
                        this.userName.textContent = this.currentUser.name;
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentApp.prototype.fetchRandomUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://randomuser.me/api/')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data.results[0]];
                }
            });
        });
    };
    CommentApp.prototype.updateCommentCount = function () {
        var count = this.countReplies(this.comments);
        this.commentCount.textContent = "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 (".concat(count, ")");
    };
    CommentApp.prototype.countReplies = function (comments) {
        var _this = this;
        var count = comments.length;
        comments.forEach(function (comment) {
            if (comment.replies.length > 0) {
                count += _this.countReplies(comment.replies);
            }
        });
        return count;
    };
    CommentApp.prototype.changeRating = function (commentId, change) {
        var updateRating = function (comments) {
            for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
                var comment = comments_2[_i];
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
    };
    CommentApp.prototype.replyTo = function (id) {
        this.replyToId = id;
        this.commentBody.focus();
    };
    CommentApp.prototype.toggleFavorite = function (id) {
        var toggleFavoriteStatus = function (comments) {
            for (var _i = 0, comments_3 = comments; _i < comments_3.length; _i++) {
                var comment = comments_3[_i];
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
    };
    CommentApp.prototype.toggleShowFavorites = function () {
        this.showFavoritesOnly = !this.showFavoritesOnly;
        this.showComments();
    };
    CommentApp.prototype.filterFavoriteComments = function (comments) {
        return comments.filter(function (comment) { return comment.isFavorite || comment.replies.some(function (reply) { return reply.isFavorite; }); });
    };
    return CommentApp;
}());
document.addEventListener('DOMContentLoaded', function () {
    window.app = new CommentApp();
});
