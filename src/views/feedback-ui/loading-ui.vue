<template>
  <div>
    <BackTop element="main" />
    <Collapse class="collapseComponent">
      <Card class="card" name="extra" :title="$t('Router.LoadingUi')">
        <Space wrap size="large">
          <Button @click="start()">start</Button>
          <Button @click="finish">finish</Button>
          <Button @click="error">error</Button>
          <Button @click="upload(30)">upload 30%</Button>
          <Button @click="upload(80)">upload 80%</Button>
          <Button @click="destroy()">destroy</Button></Space
        >
      </Card>
      <Panel :title="$t('Card.NoInformationTemporarily')" key="1"> </Panel>
    </Collapse>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    upload(percent) {
      this.$Loading.upload(percent);
    },
    start() {
      this.$Loading.start();
    },
    finish() {
      this.$Loading.finish();
    },
    error() {
      this.$Loading.error();
    },
    destroy() {
      this.$Loading.destroy();
    },
  },
};
</script>
<style scoped lang="scss"></style>
