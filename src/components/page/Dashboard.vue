<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:100%;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userinfo.Username}}</div>
                            <!--<div>{{role}}</div>-->
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>{{userinfo.UpdatedAt}}</span></div>
                    <!--<div class="user-info-list">上次登录地点：<span>东莞</span></div>-->
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :span="16">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class="grid-content grid-con-3">
                            <i class="el-icon-lx-time grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{orderCount}}</div>
                                <div>今日成交量</div>
                            </div>
                        </div>
                    </el-card>
                </el-row>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userCount}}</div>
                                    <div>新增用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{amountFlow / 100}}</div>
                                    <div>今日流水</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>


            </el-col>
        </el-row>
        <el-row :gutter="20">

            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line"
                            :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import qs from '../../util/request'

    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                todoList: [{
                    title: '今天要修复100个bug',
                    status: false,
                },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }, {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: true,
                    }
                ],
                data: [],

                options2: {
                    title: '最近七天订单成交量',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                },
                orderCount: 0,
                userCount: 0,
                amountFlow: 0,
                orderTrend: [],
                userinfo: {}

            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created() {
            let parseUserinfo = JSON.parse(localStorage.getItem("userinfo"));
            parseUserinfo.UpdatedAt = this.formatCreatedAt('', '', parseUserinfo.UpdatedAt);
            this.userinfo = parseUserinfo;

            this.handleListener();
            this.changeDate();
            this.getUserCount();
            this.getOrderCount();
            this.getAmountFlow();
            this.getOrderTrend();
        },
        activated() {
            this.handleListener();
        },
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            formatCreatedAt(row, column, cellValue) {
                let date = new Date(Date.parse(cellValue));
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s //
            },
            getUserCount() {
                qs.post("/api/admin/dashBoard/user/count").then(res => {
                    if (res.code === 10000) {
                        console.log(res.data);
                        this.userCount = res.data;
                    }
                })
            },

            getOrderCount() {
                qs.post("/api/admin/dashBoard/order/count").then(res => {
                    if (res.code === 10000) {
                        console.log(res.data)
                        this.orderCount = res.data;
                    }
                })
            },

            getAmountFlow() {
                qs.post("/api/admin/dashBoard/amount/flow").then(res => {
                    if (res.code === 10000) {
                        console.log(res.data)
                        this.amountFlow = res.data;
                    }
                })
            },
            getOrderTrend() {
                qs.post("/api/admin/dashBoard/order/trend").then(res => {
                    if (res.code === 10000) {
                        console.log(res);
                        this.orderTrend = res.data;
                        for (let i = 0; i < this.orderTrend.length; i++) {
                            let d = {
                                name: this.orderTrend[i].Date,
                                value: this.orderTrend[i].Volume
                            }
                            this.data = this.data.concat(d)
                        }
                        console.log(this.data)
                    }
                })
            },


            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                })
            },
            handleListener() {
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg) {
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart() {
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
