import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';
const CAT_COLORS = {
  vitamin:{bg:'rgba(79,212,160,0.15)',text:'#4FD4A0'}, mineral:{bg:'rgba(155,109,255,0.15)',text:'#C4A8FF'},
  weight:{bg:'rgba(255,170,60,0.15)',text:'#FFAA3C'}, gym:{bg:'rgba(100,160,255,0.15)',text:'#64A0FF'},
  amino:{bg:'rgba(200,200,212,0.15)',text:'#C8C8D4'}, nootropic:{bg:'rgba(255,200,100,0.15)',text:'#FFC864'},
  sarm:{bg:'rgba(255,92,122,0.2)',text:'#FF5C7A'}, peptide:{bg:'rgba(220,100,255,0.15)',text:'#DC64FF'},
};
export const CAT_DOT = { vitamin:'#4FD4A0',mineral:'#9B6DFF',weight:'#FFAA3C',gym:'#64A0FF',amino:'#C8C8D4',nootropic:'#FFC864',sarm:'#FF5C7A',peptide:'#DC64FF' };
export function CategoryBadge({ cat }) {
  const c = CAT_COLORS[cat] || {bg:Colors.bgElevated,text:Colors.silver};
  return <View style={[s.badge,{backgroundColor:c.bg}]}><Text style={[s.badgeText,{color:c.text}]}>{cat}</Text></View>;
}
export function SectionLabel({ children }) { return <Text style={s.sectionLabel}>{children}</Text>; }
export function MetricCard({ value, label, valueColor }) {
  return <View style={s.metric}><Text style={[s.metricNum,valueColor?{color:valueColor}:{}]}>{value}</Text><Text style={s.metricLbl}>{label}</Text></View>;
}
export function StackCard({ item, onRemove, onDoseChange }) {
  const dot = CAT_DOT[item.cat] || Colors.silver;
  return (
    <View style={s.card}>
      <View style={[s.dot,{backgroundColor:dot}]}/>
      <View style={s.info}>
        <Text style={s.name} numberOfLines={1}>{item.name}</Text>
        <Text style={s.meta}>{item.cat}{item.ul?' · UL '+item.ul+' '+item.unit:''}{item.sarmFlag?' · SARM':''}{item.peptideFlag?' · Peptide':''}</Text>
      </View>
      <View style={s.doseRow}>
        <TextInput style={s.doseInput} value={String(item.dose)} onChangeText={v=>onDoseChange(item.id,v)} keyboardType="decimal-pad" selectTextOnFocus/>
        <Text style={s.unit}>{item.unit}</Text>
      </View>
      <TouchableOpacity style={s.removeBtn} onPress={()=>onRemove(item.id)}><Text style={s.removeX}>×</Text></TouchableOpacity>
    </View>
  );
}
const SEV = {
  ok:{bg:'rgba(79,212,160,0.10)',border:'#4FD4A0',title:'#4FD4A0'},
  warn:{bg:'rgba(255,170,60,0.10)',border:'#FFAA3C',title:'#FFAA3C'},
  danger:{bg:'rgba(255,92,122,0.10)',border:'#FF5C7A',title:'#FF5C7A'},
};
export function AnalysisCard({ sev, title, text }) {
  const c = SEV[sev]||SEV.warn;
  return <View style={[s.aCard,{backgroundColor:c.bg,borderLeftColor:c.border}]}><Text style={[s.aTitle,{color:c.title}]}>{title}</Text><Text style={s.aBody}>{text}</Text></View>;
}
export function NutrientBar({ label, value, ul, unit }) {
  const pct = ul ? Math.min((value/ul)*100,105) : 50;
  const cls = !ul?'ok':value>ul?'danger':value>ul*0.8?'warn':'ok';
  const fill = cls==='ok'?Colors.purpleBright:cls==='warn'?Colors.warn:Colors.danger;
  return (
    <View style={s.barRow}>
      <Text style={s.barLbl} numberOfLines={1}>{label}</Text>
      <View style={s.barTrack}><View style={[s.barFill,{width:pct.toFixed(1)+'%',backgroundColor:fill}]}/></View>
      <Text style={s.barVal}>{ul?Math.round(value*10)/10+'/'+ul+' '+unit:Math.round(value*10)/10+' '+unit}</Text>
    </View>
  );
}
export function EmptyState({ emoji, text }) {
  return <View style={s.empty}><Text style={s.emptyEmoji}>{emoji}</Text><Text style={s.emptyText}>{text}</Text></View>;
}
const s = StyleSheet.create({
  badge:{paddingHorizontal:8,paddingVertical:3,borderRadius:999},
  badgeText:{fontSize:10,fontWeight:'600'},
  sectionLabel:{fontSize:11,fontWeight:'600',color:Colors.silverDim,textTransform:'uppercase',letterSpacing:0.8,marginBottom:8},
  metric:{flex:1,backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,borderRadius:14,padding:12},
  metricNum:{fontSize:28,fontWeight:'700',color:Colors.white,lineHeight:32},
  metricLbl:{fontSize:10,fontWeight:'500',color:Colors.silverDim,textTransform:'uppercase',letterSpacing:0.5,marginTop:4},
  card:{flexDirection:'row',alignItems:'center',backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,borderRadius:16,padding:12,marginBottom:8,gap:8},
  dot:{width:10,height:10,borderRadius:5},
  info:{flex:1,minWidth:0},
  name:{fontSize:14,fontWeight:'600',color:Colors.white},
  meta:{fontSize:11,color:Colors.silverDim,marginTop:2},
  doseRow:{flexDirection:'row',alignItems:'center',gap:4},
  doseInput:{width:58,paddingVertical:6,paddingHorizontal:8,backgroundColor:Colors.bgInput,borderWidth:1,borderColor:Colors.border,borderRadius:10,fontFamily:'Courier',fontSize:13,color:Colors.purpleSoft,textAlign:'center'},
  unit:{fontSize:11,color:Colors.silverDim,minWidth:28},
  removeBtn:{width:28,height:28,borderRadius:14,backgroundColor:'rgba(255,92,122,0.1)',alignItems:'center',justifyContent:'center'},
  removeX:{fontSize:18,color:Colors.danger,lineHeight:22},
  aCard:{borderLeftWidth:3,borderRadius:12,padding:12,marginBottom:8},
  aTitle:{fontSize:13,fontWeight:'600',marginBottom:4},
  aBody:{fontSize:12,lineHeight:18,color:Colors.silver},
  barRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  barLbl:{fontSize:12,fontWeight:'500',color:Colors.silver,width:96},
  barTrack:{flex:1,height:6,backgroundColor:'rgba(255,255,255,0.07)',borderRadius:3,overflow:'hidden'},
  barFill:{height:'100%',borderRadius:3},
  barVal:{fontFamily:'Courier',fontSize:10,color:Colors.silverDim,width:80,textAlign:'right'},
  empty:{backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,borderStyle:'dashed',borderRadius:16,padding:32,alignItems:'center'},
  emptyEmoji:{fontSize:32,marginBottom:8,opacity:0.5},
  emptyText:{fontSize:13,color:Colors.silverDim,textAlign:'center',lineHeight:20},
});