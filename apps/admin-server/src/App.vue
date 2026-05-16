<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
.el-form--inline .el-select {
  min-width: 120px;
}

.el-select {
  min-width: 80px;
}

.el-select .el-input__inner {
  color: #606266 !important;
}

.el-select .el-input__inner::placeholder {
  color: #a8abb2;
}

.el-select .el-select__selected-item span {
  color: #606266 !important;
  overflow: visible !important;
}

.el-select .el-select__selected-item {
  max-width: none !important;
}

.el-popper.is-light {
  z-index: 2001 !important;
}

.el-popper.el-select__popper {
  z-index: 2000 !important;
}

.el-aside .el-menu {
  border-right: none;
}

.el-form-item__content .el-select .el-input {
  width: auto !important;
}
</style>