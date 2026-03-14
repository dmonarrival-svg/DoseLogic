import React from 'react';
import {View,Text,ScrollView,StyleSheet,SafeAreaView,StatusBar} from 'react-native';
import {useStack} from '../context/StackContext';
import {AnalysisCard,SectionLabel,EmptyState} from '../components';
import {Colors,Spacing,Radius} from '../theme';
export default function AnalysisScreen() {
  const {stack,getInteractions,getULFlags}=useStack();
  const interactions=getInteractions();
  const ulFlags=getULFlags();
  const sarms=stack.filter(s=>s.sarmFlag);
  const dangers=interactions.filter(x=>x.sev==='danger');
  const warns=interactions.filter(x=>x.sev==='warn');
  const oks=interactions.filter(x=>x.sev==='ok');
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDeep}/>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Analysis</Text>
        {stack.length===0?<EmptyState emoji="🔬" text="Add supplements to see interaction and risk analysis"/>:<>
          {sarms.length>0&&<View style={s.sarmBanner}><Text style={s.sarmIcon}>⚠️</Text><View style={s.sarmBody}><Text style={s.sarmTitle}>SARMs in stack ({sarms.length})</Text><Text style={s.sarmText}>Not FDA-approved. Risks: hormonal suppression, liver stress, cardiovascular strain. Bloodwork strongly recommended. PCT may be required.</Text></View></View>}
          {ulFlags.length>0&&<><SectionLabel>Exceeds Upper Limit</SectionLabel>{ulFlags.map(s=><AnalysisCard key={s.id} sev="danger" title={s.name+' — above UL'} text={'Your dose ('+s.dose+' '+s.unit+') exceeds UL of '+s.ul+' '+s.unit+'.'}/>)}</>}
          {dangers.length>0&&<><SectionLabel>Danger — Avoid or Monitor Closely</SectionLabel>{dangers.map(i=><AnalysisCard key={i.key} sev="danger" title={i.a.name+' + '+i.b.name} text={i.text}/>)}</>}
          {warns.length>0&&<><SectionLabel>Caution — Timing or Dose Matters</SectionLabel>{warns.map(i=><AnalysisCard key={i.key} sev="warn" title={i.a.name+' + '+i.b.name} text={i.text}/>)}</>}
          {oks.length>0&&<><SectionLabel>Synergistic Pairings</SectionLabel>{oks.map(i=><AnalysisCard key={i.key} sev="ok" title={i.a.name+' + '+i.b.name} text={i.text}/>)}</>}
          {ulFlags.length===0&&interactions.length===0&&<AnalysisCard sev="ok" title="No interactions detected" text={'Stack of '+stack.length+' supplement'+(stack.length>1?'s':'')+' has no flagged interactions.'}/>}
        </>}
        <View style={s.disclaimer}><Text style={s.disclaimerText}>⚠️ For informational use only. Not medical advice. Consult a healthcare professional before starting any supplement regimen.</Text></View>
        <View style={{height:Spacing.xxl}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:Colors.bgDeep}, scroll:{flex:1}, content:{padding:Spacing.xl,paddingBottom:0},
  title:{fontSize:28,fontWeight:'700',color:Colors.white,letterSpacing:-0.5,marginBottom:Spacing.xl},
  sarmBanner:{flexDirection:'row',gap:Spacing.md,backgroundColor:'rgba(255,92,122,0.1)',borderWidth:1,borderColor:'rgba(255,92,122,0.3)',borderRadius:Radius.lg,padding:Spacing.md,marginBottom:Spacing.lg},
  sarmIcon:{fontSize:20}, sarmBody:{flex:1},
  sarmTitle:{fontSize:13,fontWeight:'600',color:Colors.danger,marginBottom:4},
  sarmText:{fontSize:12,color:Colors.silver,lineHeight:18},
  disclaimer:{backgroundColor:'rgba(155,109,255,0.06)',borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,padding:Spacing.md,marginTop:Spacing.lg},
  disclaimerText:{fontSize:11,color:Colors.silverDim,lineHeight:17},
});