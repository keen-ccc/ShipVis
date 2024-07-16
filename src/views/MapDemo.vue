<script setup>
import { ref, onMounted, h, computed, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as d3 from 'd3'
import 'leaflet-mouse-position'
import { create } from 'd3'
import { useMonthStore } from '@/stores/counter'
const monthStore = useMonthStore()
let MatrixData = computed(() => monthStore.monthResult)

//const matrixData = [[0.0013366633655564485, 0.0013521337838795775, 0.0013660363306790262, 0.0013783192258697726, 0.0013889364219782112, 0.0013978478914936639, 0.0014050198780804193, 0.001410425109447403, 0.0014140429699970973, 0.0014158596317261818, 0.0014158681422148716, 0.001414068468922703, 0.0014104674993953618, 0.0014050789973822223, 0.00139792351525269, 0.0013890282634947497, 0.0013784269384499973, 0.0013661595098139368, 0.0013522719697740175, 0.0013368160459860173], [0.001352137415365004, 0.0013677851737626898, 0.0013818468744403742, 0.001394270144199042, 0.001405008409050365, 0.0014140211848553204, 0.0014212743314038609, 0.0014267402677051906, 0.0014303981465925242, 0.0014322339870933352, 0.0014322407633927344, 0.001430418449596603, 0.0014267740198965584, 0.0014213214041344413, 0.001414081399162875, 0.0014050815367909442, 0.0013943559094864411, 0.0013819449553786525, 0.0013678952044572808, 0.0013522589881952798], [0.0013660415802052893, 0.0013818484724660268, 0.0013960529615057724, 0.001408602141957474, 0.0014194489675366574, 0.001428552544628079, 0.0014358783889367266, 0.0014413986429496334, 0.0014450922522902547, 0.0014469450994057237, 0.0014469500933990379, 0.00144510721520706, 0.0014414235177213752, 0.0014359130808516954, 0.001428596921931694, 0.0014195028622653496, 0.0014086653509960748, 0.001396125247862119, 0.001381929566750602, 0.0013661311823017935], [0.0013783240113230159, 0.001394271237443843, 0.0014086016164823196, 0.0014212617738361302, 0.001432204246904887, 0.0014413877812778587, 0.0014487775896500456, 0.001454345571194983, 0.0014580704894612254, 0.0014599381072148035, 0.001459941277034175, 0.001458079986847165, 0.001454361360007719, 0.0014487996099109715, 0.0014414159495492725, 0.0014322384568154498, 0.0014213018967503006, 0.0014086475023056542, 0.0013943227155571436, 0.001378380891638884], [0.0013889386073871423, 0.0014050068403354881, 0.0014194457381885692, 0.0014322015218025139, 0.001443226369806207, 0.0014524787170289177, 0.001459923515368314, 0.0014655324548090768, 0.0014692841426431778, 0.001471164239306102, 0.0014711655496217916, 0.0014692880686443246, 0.0014655389816899758, 0.00145993261855576, 0.001452490362336375, 0.0014432405136475274, 0.0014322181114636147, 0.0014194647121540131, 0.001405028128668416, 0.0013889621321584588], [0.0013978453025242457, 0.0014140147582957661, 0.0014285443939399524, 0.001441380091993434, 0.0014524737312139478, 0.0014617834868806867, 0.0014692740932921204, 0.0014749170661583883, 0.0014786908829248278, 0.0014805811194330643, 0.0014805805417042889, 0.00147868915202866, 0.0014749141889499207, 0.0014692700811466983, 0.0014617783556183405, 0.001452467500996643, 0.0014413727871923714, 0.0014285360429777685, 0.0014140053934621794, 0.0013978349597683914], [0.0014050103180747813, 0.0014212608286232867, 0.0014358630767541116, 0.0014487626741908452, 0.00145991125985726, 0.0014692668016770042, 0.0014767938603735776, 0.0014824638129586267, 0.001486255033933251, 0.001488153032603927, 0.0014881505452886512, 0.0014862475815958908, 0.0014824514243623277, 0.001476776583251773, 0.0014692447024264705, 0.001459884423114301, 0.0014487312022911545, 0.0014358270890830948, 0.0014212204608623263, 0.0014049657213496883], [0.00141040637585896, 0.0014267174644516686, 0.001441373923217532, 0.0014543211616037427, 0.0014655106396514643, 0.0014749001709129534, 0.0014824541872225485, 0.001488143962996993, 0.0014919477970888808, 0.0014938511505816145, 0.001493846739302924, 0.0014919345802344205, 0.0014881219914024456, 0.0014824235452527198, 0.0014748609759219497, 0.001465463041234517, 0.0014542653406468178, 0.0014413100907527722, 0.001426645860329597, 0.0014103272672477878], [0.0014140128710682968, 0.0014303638295989532, 0.001445055890087012, 0.0014580343290133567, 0.0014692504891707229, 0.0014786620833141665, 0.0014862334595658645, 0.0014919358262451233, 0.0014957474341393993, 0.0014976537146056575, 0.0014976473722730678, 0.0014957284315236731, 0.0014919042363358644, 0.0014861894034938416, 0.0014786057295774978, 0.0014691820525624447, 0.0014579540692585076, 0.0014449641102012036, 0.0014302608739843027, 0.0014138991233620599], [0.001415816003250918, 0.0014321859710235306, 0.0014468948880635704, 0.0014598879677040389, 0.0014711164975721451, 0.0014805381435857969, 0.0014881172156533443, 0.0014938248927455697, 0.0014976394053533477, 0.0014995461737175525, 0.0014995379006033335, 0.0014976146177915128, 0.0014937836858763195, 0.001488059747367582, 0.0014804646335183412, 0.0014710272257039483, 0.0014597832725868512, 0.0014467751646826065, 0.0014320516683168916, 0.0014156676213070108], [0.001415808864227285, 0.0014321769077126748, 0.0014468838715482031, 0.001459874975979901, 0.001471101515763647, 0.0014805211641193959, 0.0014880982383864438, 0.001493803925048882, 0.001497616462146753, 0.0014995212774583622, 0.001499511081225722, 0.001497585912599795, 0.001493753139389735, 0.0014880274111202974, 0.0014804305658138086, 0.0014709914913279604, 0.0014597459424792575, 0.0014467363155710943, 0.0014320113823170029, 0.0014156259854893687], [0.0014139914821518957, 0.001430336675208102, 0.001445022883580137, 0.0014579954044606346, 0.001469205602001514, 0.0014786112108360532, 0.0014861766013501666, 0.0014918730043748248, 0.0014956786933160993, 0.00149757912211362, 0.0014975670177994106, 0.0014956424268366833, 0.0014918127148217035, 0.0014860925195556273, 0.0014785036579017577, 0.001469074987256917, 0.0014578422228692068, 0.0014448477126166996, 0.001430140171235117, 0.001413774376325362], [0.001410370821328027, 0.0014266723253742236, 0.0014413190555564684, 0.0014542564557534898, 0.0014654360215139524, 0.001474815602760571, 0.0014823596683389583, 0.0014880395300895628, 0.001491833524466103, 0.0014937271500934683, 0.0014937131600426257, 0.0014917916080027308, 0.0014879698479383196, 0.001482262487233681, 0.0014746912937446267, 0.0014652850575815122, 0.0014540794088533195, 0.0014411165929843364, 0.0014264452055861377, 0.0014101198892107242], [0.0014049607377781045, 0.0014211978814097036, 0.0014357865617369975, 0.001448672438502886, 0.001459807200151108, 0.001469148865328744, 0.001476662046376983, 0.0014823181724990583, 0.0014860956706368455, 0.0014879801024530689, 0.0014879642562067395, 0.0014860481927000202, 0.0014822392448902042, 0.001476551971168299, 0.0014690080627224576, 0.0014596362058083047, 0.0014484719001504553, 0.0014355572350836785, 0.0014209406254044271, 0.001404676509255619], [0.0013977818909654545, 0.0014139342485036254, 0.0014284465289377617, 0.001441264676228579, 0.0014523406324766896, 0.0014616326378443613, 0.0014691054926566503, 0.001474730779384913, 0.0014784870425535277, 0.0014803599249762743, 0.0014803422591145145, 0.0014784341127432282, 0.0014746427885180473, 0.0014689827774475677, 0.0014614756666844657, 0.0014521500024578982, 0.0014410411093620222, 0.0014281908676013874, 0.0014136474501579971, 0.0013974650221856963], [0.0013888616124537864, 0.0014049090809338473, 0.0014193269022207903, 0.0014320613717647892, 0.0014430647451201698, 0.0014522955359117088, 0.0014597187762214745, 0.0014653062371107872, 0.0014690366073345279, 0.0014708956286607104, 0.0014708761866003897, 0.0014689783557348807, 0.0014652093992395191, 0.0014595837226073134, 0.001452122781985134, 0.0014428549479375587, 0.0014318153258478154, 0.0014190455345476994, 0.001404593445125203, 0.0013885128822050407], [0.0013782337326725637, 0.0013941566067873679, 0.0014084622677715982, 0.0014210974285047548, 0.0014320147166030405, 0.001441172970064632, 0.0014485374956228578, 0.0014540802875373238, 0.0014577802048933864, 0.0014596231058432833, 0.0014596019375935295, 0.0014577167813402312, 0.0014539748517498005, 0.0014483904509921906, 0.0014409848777348943, 0.0014317862919058905, 0.0014208295364303329, 0.0014081559175150255, 0.0013938129454203457, 0.0013778540379938847], [0.0013659383673227993, 0.0013817174118558493, 0.0013958936345355667, 0.00140841423003518, 0.0014192322552369933, 0.0014283069222008474, 0.0014356038541696353, 0.0014410953023659544, 0.0014447603216660517, 0.0014465849035962648, 0.0014465620654732227, 0.0014446918948914714, 0.0014409815491639437, 0.001435445209721161, 0.0014281039918717293, 0.0014189858107324397, 0.0014081252045132734, 0.0013955631167251376, 0.0013813466392297068, 0.0013655287183852861], [0.0013520216653105685, 0.001367638184617226, 0.0013816681765410122, 0.0013940593801063962, 0.0014047653370560232, 0.0014137456817955101, 0.0014209663947498496, 0.0014264000169068116, 0.0014300258236579534, 0.0014318299563957587, 0.001431805510698348, 0.0014299525803201795, 0.001426278256593013, 0.0014207965832442465, 0.0014135284670353254, 0.0014045015450153142, 0.0013937500095673665, 0.001381314392797885, 0.0013672413121698249, 0.0013515831796100638], [0.0013365355204215045, 0.0013519714245401667, 0.0013658389381726208, 0.0013780864052227056, 0.0013886679060814884, 0.0013975435442115409, 0.00140467969656068, 0.0014100492256052546, 0.0014136316511570738, 0.0014154132804073336, 0.0014153872950584806, 0.0014135537947643443, 0.0014099197964941067, 0.0014044991898246118, 0.0013973126485597532, 0.0013883874994633865, 0.001377757549270434, 0.0013654628715097132, 0.0013515495550149798, 0.001336069416334349]]
const clickedPoint = ref(null)
// 将二维数组转换为一维数组
const flattenedData = computed(()=>{
  if(!MatrixData.value) return []
  
  return MatrixData.value.reduce((acc, val) => acc.concat(val), [])
})
// 找到最大值
const max = computed(()=>{
  return Math.max(...flattenedData.value)
}) 
//最小值
const min = computed(()=>{
  return Math.min(...flattenedData.value)
})
// console.log(min,max)
const colorScale = computed(()=>{
  //return d3.scaleSequential(d3.interpolateRgbBasis(['#ecf5d7', '#2c7da7'])).domain([min.value, max.value]);
  return d3.scaleSequential(d3.interpolateRgbBasis(['#2c7da0','#62b6cb','#bee9e8','#fed9b7','#ffb4a2','#d15b50'])).domain([min.value, max.value]);
})
// const mapDiv = ref(null)

var mapWidth = 0
var mapHeight = 0
var map = null
let handle1 = null
let handle2 = null
let x_slider = null

onMounted(()=>{
    renderMap()
})
const addCircle = (point,latlng) => {
  // x:141-458 y:114-484
  const height = 370
  // 如果已经存在圆点，那么移除它们
  if (d3.select('#x_circle').node() || d3.select('#y_circle').node() || d3.select('#x_text').node() || d3.select('#y_text').node()){
    d3.select('#x_circle').remove();
    d3.select('#y_circle').remove();
    d3.select('#x_text').remove();
    d3.select('#y_text').remove();
  }


  // 在 x 坐标轴上添加圆点
  let x_circle = d3.select('g')
    .append('circle')
    .attr('cx', point.x)
    .attr('cy', mapHeight / 2 - 370 / 2 - 30)
    .attr('r', 5)
    .attr('fill', 'red')
    .attr('id', 'x_circle')
  x_circle
    .append('animate')
    .attr('attributeName', 'r')
    .attr('begin', '0s') // 动画开始的时间
    .attr('dur', '2s') // 动画持续的时间
    .attr('from', '4') // 半径的初始值
    .attr('to', '8') // 半径的结束值
    .attr('repeatCount', 'indefinite') // 动画无限次重复
  x_circle 
    .append('animate')
    .attr('attributeName', 'fill') // 动画改变的属性是填充颜色 fill
    .attr('begin', '0s') // 动画开始的时间
    .attr('dur', '2s') // 动画持续的时间
    .attr('from', '#7caf3c') // 填充颜色的初始值
    .attr('to', '#057f44') // 填充颜色的结束值
    .attr('repeatCount', 'indefinite') // 动画无限次重复

  // 在 y 坐标轴上添加圆点
  let y_circle = d3.select('g')
    .append('circle')
    .attr('cx', mapWidth / 2 + 317 / 2 + 35)
    .attr('cy', point.y)
    .attr('r', 5)
    .attr('fill', 'red')
    .attr('id', 'y_circle')
  
  y_circle
    .append('animate')
    .attr('attributeName', 'r') // 动画改变的属性是半径 r
    .attr('begin', '0s') // 动画开始的时间
    .attr('dur', '2s') // 动画持续的时间
    .attr('from', '4') // 半径的初始值
    .attr('to', '8') // 半径的结束值
    .attr('repeatCount', 'indefinite') // 动画无限次重复
  
  y_circle 
    .append('animate')
    .attr('attributeName', 'fill') // 动画改变的属性是填充颜色 fill
    .attr('begin', '0s') // 动画开始的时间
    .attr('dur', '2s') // 动画持续的时间
    .attr('from', '#7caf3c') // 填充颜色的初始值
    .attr('to', '#057f44') // 填充颜色的结束值
    .attr('repeatCount', 'indefinite') // 动画无限次重复

  d3.select('g')
    .append('text')
    .attr('x',point.x - 20)
    .attr('y',90 - 20)
    .text(latlng.lng.toFixed(4))
    .attr('id','x_text')

  d3.select('g')
    .append('text')
    .attr('x',480 + 20)
    .attr('y',point.y + 5)
    .text(latlng.lat.toFixed(4))
    .attr('id','y_text')

}
const addLinesToHeatmap = (point) => {
  // x:91-407 y:65-430
  const height = 370
  // 如果已经存在线段，那么移除它们
  // if (d3.select('#x_line').node() || d3.select('#y_line').node()) {
  //   d3.select('#x_line').remove();
  //   d3.select('#y_line').remove();
  // }

  // 在 x 坐标轴上添加线段
  d3.select(map.getPanes().overlayPane)
    .append('line')
    .attr('x1', point.x)
    .attr('y1', mapHeight / 2 + 370 / 2)
    .attr('x2', point.x)
    .attr('y2', mapHeight / 2 - 370 / 2 - 30)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')  // 设置线段为虚线
    .attr('id', 'x_line')

  // 在 y 坐标轴上添加线段
  d3.select(map.getPanes().overlayPane)
    .append('line')
    .attr('x1', 208)
    .attr('y1', point.y)
    .attr('x2', 526)
    .attr('y2', point.y)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')  // 设置线段为虚线
    .attr('id', 'y_line')
}
const createSlider = () => {
  const width = 317
  const height = 50
  const sliderSvg = d3.select(map.getPanes().overlayPane)
    .append('svg')
    .attr('id', 'slider')
    .style('width', width)
    .style('height', height)
    .style('transform', `translate(${(mapWidth / 2 - width / 2)}px, ${(mapHeight / 2 + 185 + 20)}px)`)
    .append('g')
    .attr('class', 'slider')
  // 在SVG容器中定义一个linearGradient
  const gradient = sliderSvg.append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%')
    .attr('spreadMethod', 'pad')
  // 在 linearGradient 中定义颜色停止点
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', colorScale.value(min.value))
    .attr('stop-opacity', 1);
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colorScale.value(max.value))
    .attr('stop-opacity', 1);
  
  // 创建一个矩形并设置其填充为线性渐变
  const rect = sliderSvg.append('rect')
    .attr('width', width)
    .attr('height', 20)
    .attr('rx', 3) // 设置水平方向的圆角半径
    .attr('ry', 3) // 设置垂直方向的圆角半径
    .style('fill', 'url(#gradient)');
  // 创建比例尺
  x_slider = d3.scaleLinear().domain([min.value, max.value]).range([0, width-10]).clamp(true)

  //创建两个矩形作为滑块
  handle1 = sliderSvg.append('rect')
    .attr('class', 'handle')
    .attr('width',7)
    .attr('height', 20)
    .attr('x', x_slider(0))
    .attr('y', 0)
    .style('fill', 'white')
  
  handle2 = sliderSvg.append('rect')
    .attr('class', 'handle')
    .attr('width', 7)
    .attr('height', 20)
    .attr('x', x_slider(1)+5)
    .attr('y', 0)
    .style('fill', 'white')

  // 在滑块下方添加文本显示滑块的值
  const label1 = sliderSvg.append('text')
    .attr('x',x_slider(0)+18)
    .attr('y', 30)
    .text(min.value.toFixed(4))
    .attr('text-anchor', 'middle')
  
  const label2 = sliderSvg.append('text')
    .attr('x',x_slider(1)-10)
    .attr('y', 30)
    .text(max.value.toFixed(4))
    .attr('text-anchor', 'middle')
  // 添加拖动行为
  sliderSvg.selectAll('.handle')
    .call(d3.drag()
      .on('drag', function(event, d) {
        let value = x_slider.invert(event.x);//获取当前滑块的值
        // 确保 handle1 的值不会超过 handle2 的值
        if (d3.select(this).node() === handle1.node() && value > x_slider.invert(handle2.attr('x'))) {
          value = x_slider.invert(handle2.attr('x'));
        }
        // 确保 handle2 的值不会超过 handle1 的值
        if (d3.select(this).node() === handle2.node() && value < x_slider.invert(handle1.attr('x'))) {
          value = x_slider.invert(handle1.attr('x'));
        }
        d3.select(this).attr('x', x_slider(value));
        // 更新滑块的值
        if (d3.select(this).node() === handle1.node()) {
          label1.attr('x', x_slider(value)+18).text(value.toFixed(4));
        } else {value
          label2.attr('x', x_slider(value)-10).text(value.toFixed(4));
        }
        // d3.select(this).attr('cx', x(x.invert(event.x)));
        // 筛选热力图数据
        const newData = flattenedData.value.map(value =>
          value >= x_slider.invert(handle1.attr('x')) && value <= x_slider.invert(handle2.attr('x')) ? value : 0
        )
        // 更新热力图颜色
        d3.selectAll('#heatmap path')
          .data(newData)
          .attr('fill', function(d) {
            if(d >= x_slider.invert(handle1.attr('x')) && d <= x_slider.invert(handle2.attr('x'))){
              return colorScale.value(d);
            }else{
              return 'transparent';
            }
          })
          .attr('stroke', d => colorScale.value(d))
      }));
}

const createXScale = () => {
  const width = 317
  const height = 20
  const xScale = d3.scaleLinear().domain([121, 128]).range([0, width])

  // 为坐标轴创建SVG
  const x_Scale = d3.select(map.getPanes().overlayPane)
    .append('svg')
    .attr('id', 'x_Scale')
    .style('width', width)
    .attr('height', height * 2)  // 将高度扩大 2 倍
    .attr('viewBox', `0 ${-height} ${width} ${height * 2}`)  // 修改 viewBox 属性
    .style('transform', `translate(${(mapWidth / 2 - width / 2)}px, ${(mapHeight / 2 - 185 - 50)}px)`)
    .append('g')
    // .attr('class', 'xy-axis')
  // 设置坐标轴的刻度值，可以根据需求调整
  const tickValues = [122, 123, 124, 125, 126 ,127];
  x_Scale.append('g')
    // .attr('transform', `translate(10px, 100px)`)
    // .call(d3.axisBottom(xScale))
    .call(d3.axisTop(xScale).tickValues(tickValues));

    // 将坐标轴元素移动到底部
  // x_Scale.lower();
}
const createYScale = () => {
  const width = 20
  const height = 370
  const yScale = d3.scaleLinear().domain([26, 33]).range([height, 0])

  // 为坐标轴创建SVG
  const y_Scale = d3.select(map.getPanes().overlayPane)
    .append('svg')
    .attr('id', 'y_Scale')
    .style('width', width * 2)
    .style('height', height)
    .attr('viewBox', `${-width} 0 ${width * 2} ${height}`)  // 修改 viewBox 属性
    .style('transform', `translate(${(mapWidth / 2 + 317 / 2 + 15)}px, ${(mapHeight / 2 - height / 2)}px)`)
    .append('g')
    .attr('class', 'xy-axis')
  const tickValues = [27, 28, 29, 30, 31 ,32];
  y_Scale.append('g')
    .call(d3.axisRight(yScale).tickValues(tickValues));
}
const createHeatMap = () => {
    const width = 317 
    const height = 370
// 317 370
    var mapDiv = document.getElementById('map')
    var mapDiv_width = mapDiv.offsetWidth
    var mapDiv_height = mapDiv.offsetHeight
    // console.log(mapDiv_width,mapDiv_height)
    mapWidth = mapDiv_width
    mapHeight = mapDiv_height
    const heatmapSvg = d3.select(map.getPanes().overlayPane)
      .append('svg')
      .attr('id', 'heatmap')
      .style('width',width)
      .style('height',height)
      // .style('transform', `translate(${142}px, ${118}px)`)
      .style('transform',`translate(${(mapWidth / 2 - width / 2)}px, ${(mapHeight / 2 - height / 2)}px)`)

    // D3绘制船舶
    const ship = heatmapSvg.append('g')
      // .attr('transform', `translate(${width/2},${height/2})`)
      .append('path')
      .attr('d', 'M0,9.1 L3.9625,13.65 L11.8875,13.65 L15.85,9.1 L11.8875,9.1 L7.925,0 L3.925,9.1 L0,9.1')
      .attr('fill', 'transparent')

    const ships = heatmapSvg.selectAll('ship')
      .attr('id','ships')
      .data(flattenedData.value)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${(i % 20) * (width / 20)},${Math.floor(i / 20) * (height / 20)})`)
      .append('path')
      .attr('d', 'M0,9.1 L3.9625,13.65 L11.8875,13.65 L15.85,9.1 L11.8875,9.1 L7.925,0 L3.925,9.1 L0,9.1')
      .attr('fill', d => colorScale.value(d))
      .attr('stroke', d => colorScale.value(d))
      .attr('stroke-width', 1)
      .style('pointer-events', 'all')  // 确保元素可以接收鼠标事件
      .style('cursor', 'pointer')  // 设置鼠标样式为手型
      //.on('click', handleClicked())
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
    
      createXScale(map)
      createYScale(map)
      createSlider(map)
    function handleMouseOver(d,i){
      // 高亮显示当前方格
      // console.log(i) value
      d3.select(this)
        .attr('transform', 'translate(-5, -5) scale(2) translate(0, 0)')
        .attr('fill','#ef8961')  //鼠标悬停时的颜色
        .transition()  // 添加过渡效果
        .duration(150)  // 过渡持续时间
      }

    function handleMouseOut(d,i){
      // 恢复所有方格的颜色
      d3.select(this)
            .attr('fill', d => (d >= x_slider.invert(handle1.attr('x')) && d <= x_slider.invert(handle2.attr('x'))) ? colorScale.value(d) : 'transparent')
            .transition()
            .duration(150)
            .attr('transform', 'translate(0,0) scale(1)')  // 恢复原始大小
            // .style('box-shadow', 'none');  // 移除阴影效果
      }
      // 创建比例尺
}

const renderMap = ()=>{
  map = L.map('map', {
    center: [29.5, 124.5],
    zoom: 6,
    scrollWheelZoom: false,  // 禁用滚轮缩放
    doubleClickZoom: false,  // 禁用双击缩放
    zoomControl: false // 禁用缩放控制按钮
  });
  map.dragging.disable();  // 禁用拖拽
  // 添加地图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  L.control.mousePosition().addTo(map);
  var geojson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
         "coordinates": [[[121, 33], [121, 26], [128, 26], [128, 33], [121, 33]]],
        //"coordinates": [[[119,35],[119,24],[130,24],[130,35],[119,35]]],
        "type": "Polygon"
      },
      "id": 0
    }]
  };
  var geojsonLayer = L.geoJSON(geojson,{
    style:{
      fillColor:'transparent',
      fillOpacity:0.01,
      color:'blue',
      weight:0.2
    }
  }).addTo(map)
  // 调用createHeatMap函数
  createHeatMap()
  // 将热力图添加到 Leaflet 的 overlayPane 上
  map.on("viewreset", function () {
    d3.select("#heatmap")
      .raise()
  });
  map.on('zoomend',function(){
    // 获取当前地图的缩放级别和中心坐标
    const zoomLevel = map.getZoom();
    const center = map.getCenter();
    // 将中心坐标转换为像素坐标
    const centerPoint = map.latLngToContainerPoint(center);
    const newWidth = Math.min(Math.max(0, 317 * Math.pow(2, zoomLevel - 6)), 1000);
    const newHeight = Math.min(Math.max(0, 370 * Math.pow(2, zoomLevel - 6)), 1000);
    // console.log(centerPoint.x - newWidth / 2,centerPoint.y - newHeight / 2 - 45)
    const cliek_Point = clickedPoint.value
    // 新的像素坐标
    cliek_Point.x = centerPoint.x + (clickedPoint.value.x - centerPoint.x) * Math.pow(2, zoomLevel - 6)
    cliek_Point.y = centerPoint.y + (clickedPoint.value.y - centerPoint.y) * Math.pow(2, zoomLevel - 6)
    // 坐标轴的缩放
    d3.select('#x_Scale')
      .style('transform', `translate(${(centerPoint.x - newWidth / 2)}px,${(centerPoint.y - newHeight / 2 - 45)}px)`)
      .style('width', newWidth);
    d3.select('#y_Scale')
      .style('transform', `translate(${(centerPoint.x + newWidth / 2 + 4)}px, ${(centerPoint.y - newHeight / 2)}px)`)
      .style('height', newHeight); 
    //热力图缩放
    d3.select("#heatmap")
      .style('width', newWidth)
      .style('height', newHeight)
      .style('transform', `translate(${(centerPoint.x - newWidth / 2)}px, ${(centerPoint.y - newHeight / 2)}px)`);
    
    d3.select('#ships')
      .attr('transform', (d, i) => `translate(${(i % 20) * (newWidth / 20)},${Math.floor(i / 20) * (newHeight / 20)})`)

    // 线段缩放
    d3.select('#x_line')
      .attr('x1', cliek_Point.x)
      .attr('x2', cliek_Point.x)
    d3.select('#y_line')
      .attr('y1', cliek_Point.y)
      .attr('y2', cliek_Point.y)
    // 圆点缩放
    d3.select('#x_circle')
      .attr('cx', cliek_Point.x)
      .attr('cy',centerPoint.y - newHeight / 2 - 25)
    d3.select('#y_circle')
      .attr('cx', centerPoint.x + newWidth / 2 + 25)
      .attr('cy', cliek_Point.y)
  })
  map.on('click',function(event){
  // 获取点击位置的经纬度坐标
  const latlng = event.latlng;
  
  // 将经纬度坐标转换为像素坐标
  const point = map.latLngToContainerPoint(latlng);
  console.log(point)
  // 设置点击范围
  const minX = mapWidth / 2 - 317 / 2;
  const maxX = mapWidth / 2 + 317 / 2;
  const minY = mapHeight / 2 - 370 / 2;
  const maxY = mapHeight / 2 + 370 / 2;

  // 检查点击位置是否在范围内
  if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
    // 检查线段是否已经存在
    const xLine = d3.select('#x_line');
    const yLine = d3.select('#y_line');
    const xCircle = d3.select('#x_circle');
    const yCircle = d3.select('#y_circle');
    if (xLine.empty() && yLine.empty() && xCircle.empty() && yCircle.empty()) {
      // 如果线段不存在，添加线段
      addLinesToHeatmap(point);
      addCircle(point,latlng);
      clickedPoint.value = point
    } else {
      // 如果线段存在，删除线段
      xLine.remove();
      yLine.remove();
      xCircle.remove();
      yCircle.remove();
      x_text.remove();
      y_text.remove();
    }
  }
  })
}
const redrawChart = () =>{
  d3.select('#heatmap').remove()
  d3.select('#x_Scale').remove()
  d3.select('#y_Scale').remove()
  d3.select('#slider').remove()
  if (map) {
    map.remove();
    document.getElementById('map').innerHTML = ""; // 清空地图容器的内容
  }
  map = L.map('map', {
    center: [29.5, 124.5],
    zoom: 6,
    scrollWheelZoom: false,  // 禁用滚轮缩放
    doubleClickZoom: false,  // 禁用双击缩放
    zoomControl: false // 禁用缩放控制按钮
  });
  map.dragging.disable();  // 禁用拖拽
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  L.control.mousePosition().addTo(map);
  var geojson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
         "coordinates": [[[121, 33], [121, 26], [128, 26], [128, 33], [121, 33]]],
        //"coordinates": [[[119,35],[119,24],[130,24],[130,35],[119,35]]],
        "type": "Polygon"
      },
      "id": 0
    }]
  };
  var geojsonLayer = L.geoJSON(geojson,{
    style:{
      fillColor:'transparent',
      fillOpacity:0.01,
      color:'blue',
      weight:0.54
    }
  }).addTo(map)
  createHeatMap()
  // 将热力图添加到 Leaflet 的 overlayPane 上
  map.on("viewreset", function () {
    d3.select("#heatmap")
      .raise()
  });
  // map.on('click',function(event){
  // // 获取点击位置的经纬度坐标
  // const latlng = event.latlng;
  
  // // 将经纬度坐标转换为像素坐标
  // const point = map.latLngToContainerPoint(latlng);
  // console.log(point)
  // // 设置点击范围
  // const minX = mapWidth / 2 - 317 / 2;
  // const maxX = mapWidth / 2 + 317 / 2;
  // const minY = mapHeight / 2 - 370 / 2;
  // const maxY = mapHeight / 2 + 370 / 2;

  // // 检查点击位置是否在范围内
  // if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
  //   // 检查线段是否已经存在
  //   const xLine = d3.select('#x_line');
  //   const yLine = d3.select('#y_line');
  //   const xCircle = d3.select('#x_circle');
  //   const yCircle = d3.select('#y_circle');
  //   if (xLine.empty() && yLine.empty() && xCircle.empty() && yCircle.empty()) {
  //     // 如果线段不存在，添加线段
  //     addLinesToHeatmap(point);
  //     addCircle(point,latlng);
  //     clickedPoint.value = point
  //   } else {
  //     // 如果线段存在，删除线段
  //     // xLine.remove();
  //     // yLine.remove();
  //     // xCircle.remove();
  //     // yCircle.remove();
  //     // x_text.remove();
  //     // y_text.remove();
  //   }
  // }
  // })
}
watch(MatrixData,(value)=>{
  console.log(value)
  redrawChart()
})
</script>

<template>
    <div id="map" style="width:75vh;height:96vh"></div>
</template>