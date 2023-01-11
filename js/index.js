const url = "https://vue3-course-api.hexschool.io/";

const app = {
    data() {
        return {
            userInfo: {
                username: "",
                password: "",
            },
        };
    },
    created() {},
    methods: {
        login,
    },
};
Vue.createApp(app).mount("#loginApp");

function login() {
    axios
        .post(`${url}/v2/admin/signin`, this.userInfo)
        .then((res) => {
            const { message } = res.data;
            if (message === "登入成功") {
                const { token, expired } = res.data;
                document.cookie = `myToken=${token}; expires=${new Date(
                    expired
                )}`;
                alert("登入成功");
                location.href = "products.html";
            } else {
                alert("登入失敗，使用者名稱或是密碼錯誤");
            }
        })
        .catch((err) => {
            alert("系統錯誤，請稍後再登入");
            console.log(err);
        });
}
