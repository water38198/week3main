const url = "https://vue3-course-api.hexschool.io/";
const api_path = "payroom";
const app = {
    data() {
        return {
            myToken: "",
            productList: [],
            tempProduct: {},
        };
    },
    created() {
        this.myToken = document.cookie.replace(
            /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common["Authorization"] = this.myToken;
        this.isLogin();
    },
    methods: {
        isLogin() {
            axios
                .post(`${url}/v2/api/user/check`)
                .then((res) => {
                    const isSuccess = res.data.success;
                    if (isSuccess) {
                        this.getProductData();
                    } else {
                        alert("請先登入");
                        location.href = "index.html";
                    }
                })
                .catch((err) => {
                    alert("請先登入");
                    console.log(err);
                    location.href = "index.html";
                });
        },
        getProductData() {
            axios
                .get(`${url}/v2/api/${api_path}/admin/products`)
                .then((res) => {
                    this.productList = res.data.products;
                    console.log(this.productList);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        confirmProduct() {
            console.log(this.tempProduct);
        },
        editProduct(product) {
            this.tempProduct = { ...product };
            console.log(this.tempProduct);
        },
    },
};
Vue.createApp(app).mount("#productApp");
