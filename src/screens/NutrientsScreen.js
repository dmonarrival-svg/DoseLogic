import React from 'react';
import {View,Text,ScrollView,StyleSheet,SafeAreaView,StatusBar} from 'react-native';
import {useStack} from '../context/StackContext';
import {NutrientBar,SectionLabel,EmptyState} from '../components';
import {Colors,Spacing,Radius} from '../theme';
import {NUTRIENT_REFS} from '../data/supplements';
export default function NutrientsScreen() {
  const {stack,getNutrientTotals}=useStack();
  const totals=getNutrientTotals();
  const keys=Object.keys(totals).filter(k=>NUTRIENT_REFS[k]);
  const over=keys.filter(k=>NUTRIENT_REFS[k].ul&&totals[k]>NUTRIENT_REFS[k].ul);
  const near=keys.filter(k=>NUTRIENT_REFS[k].ul&&totals[k]>NUTRIENT_REFS[k].ul*0.8&&totals[k]<=NUTRIENT_REFS[k].ul);
  const safe=keys.filter(k=>!NUTRIENT_REFS[k].ul||totals[k]<=NUTRIENT_REFS[k].ul*0.8);
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDeep}/>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Nutrients</Text>
        {stack.length===0||keys.length===0?<EmptyState emoji="📊" text="Add supplements to visualize cumulative nutrient intake vs. upper limits"/>:<>
          <View style={s.legend}>
            {[{c:Colors.purpleBright,l:'Safe'},{c:Colors.warn,l:'Near UL'},{c:Colors.danger,l:'Exceeds UL'}].map(({c,l})=>(
              <View key={l} style={s.legendItem}><View style={[s.legendDot,{backgroundColor:c}]}/><Text style={s.legendText}>{l}</Text></View>
            ))}
          </View>
          {over.length>0&&<><SectionLabel>Exceeds Upper Limit</SectionLabel>{over.map(k=><NutrientBar key={k} label={NUTRIENT_REFS[k].label} value={totals[k]} ul={NUTRIENT_REFS[k].ul} unit={NUTRIENT_REFS[k].unit}/>)}</>}
          {near.length>0&&<><SectionLabel>Approaching Upper Limit</SectionLabel>{near.map(k=><NutrientBar key={k} label={NUTRIENT_REFS[k].label} value={totals[k]} ul={NUTRIENT_REFS[k].ul} unit={NUTRIENT_REFS[k].unit}/>)}</>}
          {safe.length>0&&<><SectionLabel>Within Safe Range</SectionLabel>{safe.map(k=><NutrientBar key={k} label={NUTRIENT_REFS[k].label} value={totals[k]} ul={NUTRIENT_REFS[k].ul} unit={NUTRIENT_REFS[k].unit}/>)}</>}
        </>}
        <View style={{height:Spacing.xxl}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:Colors.bgDeep}, scroll:{flex:1}, content:{padding:Spacing.xl,paddingBottom:0},
  title:{fontSize:28,fontWeight:'700',color:Colors.white,letterSpacing:-0.5,marginBottom:Spacing.xl},
  legend:{flexDirection:'row',gap:Spacing.lg,backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,padding:Spacing.md,marginBottom:Spacing.lg},
  legendItem:{flexDirection:'row',alignItems:'center',gap:6},
  legendDot:{width:8,height:8,borderRadius:4},
  legendText:{fontSize:11,color:Colors.silverDim},
});