<script lang="ts"  setup>
import { onMounted, onUnmounted } from 'vue';
import {
  Meta2d,
  register,
  registerAnchors,
  registerCanvasDraw,
} from '@meta2d/core';
import { flowPens, flowAnchors } from '@meta2d/flow-diagram';
import {
  activityDiagram,
  activityDiagramByCtx,
} from '@meta2d/activity-diagram';
import { classPens } from '@meta2d/class-diagram';
import { sequencePens, sequencePensbyCtx } from '@meta2d/sequence-diagram';
import { register as registerEcharts } from '@meta2d/chart-diagram';
import { registerHighcharts } from '@meta2d/chart-diagram';
import { registerLightningChart } from '@meta2d/chart-diagram';
import { formPens, formPath2DPens } from '@meta2d/form-diagram';
import { chartsPens } from '@meta2d/le5le-charts';
import { ftaPens, ftaPensbyCtx, ftaAnchors } from '@meta2d/fta-diagram';
import { useRoute } from 'vue-router';

const route = useRoute();

let meta2d:any = null;

onMounted(async () => {
  const options = {
    width: 1920,
    height: 1080,
    background: '#1e2430',
    color: '#bdc7db',
  }
  meta2d = new Meta2d('meta2d',options);
  //注册基本图形库
  registerBasicDiagram();
  meta2d.on('opened',opened);
  open();

  //注册企业图形库
  setTimeout(async()=>{
    (globalThis as any).userId = meta2d.store.data.userId;
    (globalThis as any).registerIot((globalThis as any).userId,'/js/2d-components.js');
    if ((globalThis as any).meta2dTools && (globalThis as any).registerToolsNew) {
      (globalThis as any).registerToolsNew();
    }
  },1000);
});

const opened = () =>{
  if(route.query.id&&(route.query.id as string).startsWith('2d')){
    meta2d.fitView(true, 0); //充满屏幕
  }else{
    meta2d.fitSizeView(true, 0); //大屏充满屏幕
  }
}

const open = ()=>{
  let url = '/json/v.json';
  if (route.query.id) {
    url = `/json/${route.query.id}.json`;
    if((route.query.id as string).startsWith('2d')){
      meta2d.setOptions({
        background: '#fff',
        color: '#000',
        width:undefined,
        height:undefined
      });
    }
  } 

  _fetch(url, function (text:any) {
    var data = JSON.parse(text);
    data.locked = 1;
    data.rule = false;
    (globalThis as any).userId = data.userId;
    meta2d.open(data);
  });
}

function _fetch(url:any, cb:any) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb && cb(xhr.responseText);
    }
  };
}

//参考文档:https://doc.le5le.com/document/119754049
function registerBasicDiagram() {
  register(flowPens());
  registerAnchors(flowAnchors());
  register(activityDiagram());
  registerCanvasDraw(activityDiagramByCtx());
  register(classPens());
  register(sequencePens());
  registerCanvasDraw(sequencePensbyCtx());
  registerEcharts();
  registerHighcharts();
  registerLightningChart();
  register(formPath2DPens());
  registerCanvasDraw(formPens());
  registerCanvasDraw(chartsPens());
  register(ftaPens());
  registerCanvasDraw(ftaPensbyCtx());
  registerAnchors(ftaAnchors());
}


onUnmounted(() => {
  meta2d?.off('opened',opened);
  meta2d?.destroy();
});
</script>

<template>
  <div class="content">
    <div id="meta2d"></div>
  </div>
</template>

<style scoped>
#meta2d {
  position: absolute !important;
  width: 100%;
  height: 100%;
  touch-action: none;
  overflow: hidden;
}
</style>
