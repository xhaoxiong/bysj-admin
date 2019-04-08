<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleDelAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="订单状态" class="handle-select mr10">
                    <el-option key="2" label="待支付" value="1"></el-option>
                    <el-option key="3" label="已支付" value="2"></el-option>
                </el-select>
                <el-input v-model="PageResult.search" placeholder="筛选关键词(订单号、酒店信息、房屋信息)"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="OrderNumber" label="订单号" sortable width="150">
                </el-table-column>
                <el-table-column prop="CreatedAt" label="创建时间" sortable width="170" :formatter="formatCreatedAt">
                </el-table-column>
                <el-table-column prop="HotelItem.chineseName" label="酒店名称" width="170">
                </el-table-column>

                <el-table-column prop="RoomInfo.roomNameCn" label="房间信息" width="120">
                    <template slot-scope="scope">
                        <span style="cursor: pointer"
                              @click="roomShow(scope.$index, scope.row)">{{scope.row.RoomInfo.roomNameCn}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="Status" label="订单状态" width="120" :formatter="formatStatus">
                </el-table-column>
                <el-table-column prop="RealInfo.averagePrice" label="应付金额" width="120">
                </el-table-column>
                <el-table-column prop="User.NickName" label="用户信息" width="120">
                    <template slot-scope="scope">
                        <span style="cursor: pointer"
                              @click="userShow(scope.$index, scope.row)">{{scope.row.User.NickName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="InDate" label="入住日期" width="120">
                </el-table-column>
                <el-table-column prop="OutDate" label="离开日期" width="120">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改订单
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="PageResult.total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="房间详细信息" :visible.sync="roomVisible" width="50%">
            <el-table :data="this.roomInfo" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">

                <el-table-column prop="roomNameCn" label="房间名称" width="100">
                </el-table-column>
                <el-table-column prop="area" label="房间大小" width="100">
                </el-table-column>

                <el-table-column prop="bedDescription" label="床位类型" width="100">
                </el-table-column>
                <el-table-column prop="isExtraBed" label="是否可加床" width="100">
                </el-table-column>
                <el-table-column prop="averagePrice" label="均价" width="75">
                </el-table-column>
                <el-table-column prop="ratePrice" label="优惠价" width="75">
                </el-table-column>
                <el-table-column label="早餐信息" width="140">
                    {{this.realInfo.mealInfo}}
                </el-table-column>
                <el-table-column label="网络信息" width="140">
                    {{this.realInfo.networkInfo}}
                </el-table-column>
                <el-table-column label="wifi" width="75">
                    {{this.realInfo.wifi}}
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="用户详细信息" :visible.sync="userVisible" width="35%">
            <el-table :data="this.userInfo" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="Avatar" label="头像" width="75">
                    <template slot-scope="scope">
                        <img :src="scope.row.Avatar" class="image" style="width: 40px;height: 40px">
                    </template>
                </el-table-column>


                <el-table-column prop="Gender" label="性别" width="60" :formatter="formatGender">
                </el-table-column>

                <el-table-column prop="Mobile" label="手机号码" width="120">
                </el-table-column>
                <el-table-column prop="NickName" label="昵称" width="75">
                </el-table-column>
                <el-table-column prop="Username" label="真实姓名" width="75">
                </el-table-column>
                <el-table-column prop="CardNumber" label="身份证号码" width="180">
                </el-table-column>

            </el-table>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="入住日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.Indate" value-format="yyyy-MM-dd"
                                    style="width: 60%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="离开日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.Outdate" value-format="yyyy-MM-dd"
                                    style="width: 60%;"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">我要修改</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delAllVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delAllVisible = false">取 消</el-button>
                <el-button type="primary" @click="delAll">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import qs from "../../util/request"

    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                delAllVisible: false,
                roomVisible: false,
                userVisible: false,
                form: {
                    ID: 0,
                    Indate: '',
                    Outdate: '',
                },
                roomInfo: [],
                userInfo: [],
                realInfo: {},
                PageResult: {
                    code: null,
                    page: 0,
                    message: '',
                    status: 0,
                    per: 10,
                    order_number: '',
                    total: 0,
                    user_id: 0,
                    data: null,
                    search: '',
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航

            userShow(index, row) {
                this.userInfo[0] = row.User;
                console.log(this.userInfo)
                this.userVisible = true
            },

            roomShow(index, row) {
                this.roomInfo[0] = row.RoomInfo;
                this.realInfo = row.RealInfo;
                console.log(this.roomInfo)
                this.roomVisible = true
            },
            formatBind(row, column, cellValue) {
                if (cellValue === 1) {
                    return "已绑定"
                } else if (cellValue === 2) {
                    return "未绑定"
                }
            },
            formatGender(row, column, cellValue) {
                if (cellValue === 1) {
                    return "男"
                } else if (cellValue === 2) {
                    return "女"
                } else {
                    return "未知"
                }
            },
            formatStatus(row, column, cellValue) {
                switch (cellValue) {
                    case 2:
                        return "待支付";
                    case 3:
                        return "已支付";
                    case 4:
                        return "已取消";
                }
            },

            formatCreatedAt(row, column, cellValue) {
                let date = new Date(Date.parse(cellValue));
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                if (date.getHours() < 10) {
                    h = '0' + h
                }
                if (date.getMinutes() < 10) {
                    m = '0' + m
                }
                if (date.getSeconds() < 10) {
                    s = '0' + s
                }

                return Y + M + D + h + m + s
            },
            handleCurrentChange(val) {
                this.PageResult.page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.PageResult.status = Number(this.select_cate)
                qs.post("/api/admin/order/list", this.PageResult).then((res) => {
                    if (res.code === 10000) {
                        this.PageResult = res;
                        this.tableData = res.data;
                        this.parseData();
                    }
                })
            },

            parseData() {
                let that = this;
                this.tableData.forEach(function (item, index) {
                    if (item.RoomInfo !== "") {
                        that.tableData[index].RoomInfo = JSON.parse(item.RoomInfo);
                    }
                    if (item.HotelItem !== "") {
                        that.tableData[index].HotelItem = JSON.parse(item.HotelItem);
                    }
                    if (item.RealInfo !== "") {
                        that.tableData[index].RealInfo = JSON.parse(item.RealInfo);
                    }

                })
            },

            encodeData() {
                let that = this;
                this.tableData.forEach(function (item, index) {
                    if (item.RoomInfo !== "") {
                        that.tableData[index].RoomInfo = JSON.stringify(item.RoomInfo);
                    }
                    if (item.HotelItem !== "") {
                        that.tableData[index].HotelItem = JSON.stringify(item.HotelItem);
                    }
                    if (item.RealInfo !== "") {
                        that.tableData[index].RealInfo = JSON.stringify(item.RealInfo);
                    }
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    Indate: item.InDate,
                    Outdate: item.OutDate,
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleDelAll() {
                this.delAllVisible = true
            },
            delAll() {
                const length = this.multipleSelection.length;
                let ids = new Array();
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                console.log(this.del_list[0])
                for (let i = 0; i < length; i++) {
                    ids.push(this.multipleSelection[i].ID)
                }

                qs.post("/api/admin/order/delete", {ids: ids}).then(res => {
                    if (res.code === 10000) {
                        this.delAllVisible = false;
                        this.$message.error('删除了' + str);
                        this.multipleSelection = [];
                    }
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                if (Date.parse(this.form.Indate) > Date.parse(this.form.Outdate)) {
                    return
                }
                this.form.ID = this.tableData[this.idx].ID;
                this.editVisible = false;
                qs.post("/api/admin/order/update", this.form).then(res => {
                    if (res.code === 10000) {
                        this.tableData[this.idx].InDate = this.form.Indate;
                        this.tableData[this.idx].OutDate = this.form.Outdate;
                        console.log(res);
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    } else if (res.code === 10014) {
                        this.$router.push('/login');
                    }
                })

            },
            // 确定删除
            deleteRow() {
                let ids = new Array();
                ids.push(this.tableData[this.idx].ID);
                qs.post("/api/admin/order/delete", {ids: ids}).then(res => {
                    if (res.code === 10000) {
                        this.$message.success('删除成功');
                        this.tableData.splice(this.idx, 1);
                        this.delVisible = false;
                    } else if (res.code === 10014) {
                        this.$router.push('/login');
                    }
                })

            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>
