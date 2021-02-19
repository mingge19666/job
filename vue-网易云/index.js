// 注意. 将 #app 作为vue 挂载的 dom 之后, 原生事件内的监听失效, 原因是 dom 元素已经被 vue 替换
// 作业要求, 
// 1. 将事件侦听移至 html 内用 @click 监听
// 2. 将函数放置 methods 内
// 3. 使用循环渲染渲染搜索数据, 并为元素添加点击事件用于播放(需要 ref 知识,后做)
async function ajax({ url, params }) {
    let paramsArr = [];
    for (let key in params) {
        let item = `${key}=${params[key]}`;
        paramsArr.push(item)
    }
    let get_params = paramsArr.length ? `?${paramsArr.join("&")}` : '';
    url += get_params
    let response = await fetch(url);
    return response.json();
};
let app = new Vue({
    el: "#app",
    data: {
        limit: 20,
        page: 0,
        songCount: 0,
        songs: {},
        keywords: ''
    },
    methods: {
        // 获取数据，实时搜索进行页面渲染
        async getSongsData() {
            let data = await ajax({
                url: "http://musicapi.leanapp.cn/search",
                params: {
                    keywords: this.keywords,
                    limit: this.limit,
                    offset: this.page * this.limit
                },
            });
            this.songCount = data.result.songCount;
            this.songs = data.result.songs;
        },
        
        // 播放歌曲
        play(songid) {
            this.$refs.myMusic.src = `https://music.163.com/song/media/outer/url?id=${songid}.mp3`
            this.$refs.myMusic.play();  //立即播放
        },

        // 搜索按钮监听
        sendBtn() {
            // 前置验证
            if (!keywords.value) {
                alert("请输入关键词再搜索!")
                // 如果用户输入为空, 终止后续请求
                return
            }
            this.getSongsData();
        },
        // 上一首按钮监听
        prevBtn() {
            if (this.page == 0) {
                alert("已经没有上一页了!")
                return
            }
            // 修改页数 并重新请求数据重新渲染
            this.page--;
            this.getSongsData();
        },
        // 下一首按钮监听
        nextBtn() {
            // console.log("当前所在", page * limit);
            if (this.page * this.limit >= this.songCount) {
                alert("已无更多数据")
                return
            }
            // 修改页数 并重新请求数据重新渲染
            this.page++;
            this.getSongsData();
        }
    },
    filters: {
        // 时长处理
        formatTime(time) {
            let min = Math.floor(time / 1000 / 60);
            let sec = Math.floor(time / 1000 % 60);
            min = min >= 10 ? min : "0" + min;
            sec = sec >= 10 ? sec : "0" + sec;
            return `${min}分${sec}秒`;
        },
        // 多歌手处理
        formatArt(arr) {
            let result = arr.reduce(function (res, el) {
                return res += `/${el.name}`
            }, '')
            // console.log(result);
            return result.slice(1);
        }
    }
})