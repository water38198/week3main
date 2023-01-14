const url = "https://vue3-course-api.hexschool.io/";
const api_path = "payroom";
let productModal = null;
let deleteModal = null;
const app = {
    data() {
        return {
            myToken: "",
            productList: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: true,
            deleteId: "",
        };
    },
    created() {
        //取出Token
        this.myToken = document.cookie.replace(
            /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        axios.defaults.headers.common["Authorization"] = this.myToken;
        //檢查是否登入
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
                .get(`${url}/v2/api/${api_path}/admin/products/all`)
                .then((res) => {
                    this.productList = res.data.products;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        confirmProduct() {
            // 將空的網址移除
            this.tempProduct.imagesUrl = this.tempProduct.imagesUrl.filter(
                (image) => image
            );
            // 如果是新增產品，用post
            if (this.isNew) {
                axios
                    .post(`${url}/v2/api/${api_path}/admin/product`, {
                        data: this.tempProduct,
                    })
                    .then((res) => {
                        const { success } = res.data;
                        if (success) {
                            alert("新增成功");
                            productModal.hide();
                            this.getProductData();
                        } else {
                            alert(res.data.message);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                //如果是編輯產品，改成用put
                axios
                    .put(
                        `${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`,
                        {
                            data: this.tempProduct,
                        }
                    )
                    .then((res) => {
                        alert(res.data.message);
                        this.getProductData();
                        //關閉modal
                        productModal.hide();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        editProduct(product) {
            this.isNew = false;
            this.tempProduct = { ...product };
        },
        createNewProduct() {
            this.isNew = true;
            this.tempProduct = { imagesUrl: [] };
        },
        removeProduct() {
            axios
                .delete(
                    `${url}/v2/api/${api_path}/admin/product/${this.deleteId}`
                )
                .then((res) => {
                    alert(res.data.message);
                    this.getProductData();
                    this.deleteId = "";
                    deleteModal.hide();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        addNewPhoto() {
            // 如果新增的圖片網址為空，則不能再新增新的input
            if (
                this.tempProduct.imagesUrl[
                    this.tempProduct.imagesUrl.length - 1
                ] !== ""
            ) {
                this.tempProduct.imagesUrl.push("");
            }
        },
    },
    mounted() {
        // 抓取Modal的DOM，這樣確認之後才會自動關閉(productModal.hide())
        productModal = new bootstrap.Modal(
            document.getElementById("productModal"),
            {
                keyboard: false,
            }
        );
        deleteModal = new bootstrap.Modal(
            document.getElementById("deleteModal"),
            {
                keyboard: false,
            }
        );
    },
};
Vue.createApp(app).mount("#productApp");
