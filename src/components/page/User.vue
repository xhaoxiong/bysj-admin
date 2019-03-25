<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->

                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="ID" label="ID" sortable width="150">
                </el-table-column>
                <el-table-column prop="CreatedAt" label="日期" sortable width="150" :formatter="formatCreatedAt">
                </el-table-column>

                <el-table-column prop="Avatar" label="头像" sortable width="150">
                    <template slot-scope="scope">
                        <img :src="scope.row.Avatar" class="image" style="width: 80px;height: 80px">
                    </template>
                </el-table-column>


                <el-table-column prop="Gender" label="性别" sortable width="75" :formatter="formatGender">
                </el-table-column>
                <el-table-column prop="Mobile" label="手机号码" sortable width="180">
                </el-table-column>
                <el-table-column prop="NickName" label="昵称" sortable width="150">
                </el-table-column>
                <el-table-column prop="Username" label="真实姓名" sortable width="150">
                </el-table-column>
                <el-table-column prop="CardNumber" label="身份证号码" sortable width="180">
                </el-table-column>

                <el-table-column prop="IsBind" label="是否绑定" sortable width="80" :formatter="formatBind">
                </el-table-column>
                <!--<el-table-column prop="Openid" label="openid" sortable width="150">-->
                <!--</el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <!--<el-button type="text" icon="el-icon-delete" class="red"-->
                        <!--@click="handleDelete(scope.$index, scope.row)">删除-->
                        <!--</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="85px">

                <el-form-item label="姓名">
                    <el-input v-model="form.Username"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码">
                    <el-input v-model="form.CardNumber"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.Mobile"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
        <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="delVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="deleteRow">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import qs from "../../util/request"

    export default {
        name: 'basetable',
        data() {
            return {
                url: '',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    Username: '',
                    CardNumber: '',
                    Mobile: '',
                },
                idx: -1,
                total: 0,
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
            formatCreatedAt(row, column, cellValue) {
                let date = new Date(Date.parse(cellValue));
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s //呀麻碟
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
            formatBind(row, column, cellValue) {
                if (cellValue === 1) {
                    return "已绑定"
                } else if (cellValue === 2) {
                    return "未绑定"
                }
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                qs.get("/api/admin/user/list", {
                    params: {
                        page: this.cur_page,
                        search: this.select_word
                    }
                }).then((res) => {
                    this.total = res.total
                    this.tableData = res.data
                })
            },
            search() {
                this.getData();
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
                    Username: item.Username,
                    CardNumber: item.CardNumber,
                    Mobile: item.Mobile,
                }

                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                let item = this.tableData[this.idx];
                item.CardNumber = this.form.CardNumber;
                item.Mobile = this.form.Mobile;
                item.Username = this.form.Username;

                if (!this.RegCardNumber(item.CardNumber)) {
                    this.$message.error("请输入正确的身份证号码");
                    return
                }

                if (!this.RegMobile(item.Mobile)) {
                    this.$message.error("请输入正确的手机号码");
                    return
                }
                if (this.form.CardNumber !== "" && this.form.Mobile !== "") {
                    item.IsBind = 1
                }
                let data = JSON.stringify({
                    ID: this.tableData[this.idx].ID,
                    CardNumber: this.form.CardNumber,
                    IsBind: this.form.IsBind,
                    Mobile: this.form.Mobile,
                    Username: this.form.Username
                })

                qs.post("/api/admin/user/update", data).then((res) => {
                    if (res.code === 10000) {
                        this.$set(this.tableData, this.idx, item);
                    } else if (res.code === 10014) {
                        this.$router.push('/login');
                    }
                })
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            },
            // 确定删除
            deleteRow() {
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                console.log(this.tableData[this.idx])
                qs.post("/api/admin/user/delete", this.tableData[this.idx].ID).then((res) => {
                    console.log(res)
                })
                this.delVisible = false;
            },
            RegCardNumber(CardNumber) {
                let reg15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                let reg18 = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if (reg15.test(CardNumber)) {
                    return true
                } else if (reg18.test(CardNumber)) {
                    return true
                }
                return false
            },
            RegMobile(Mobile) {
                let reg = /^1[3|4|5|7|8]\d{9}/
                if (reg.test(Mobile)) {
                    return true
                }
                return false
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
