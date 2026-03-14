import React,{useState,useCallback} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,SafeAreaView,StatusBar} from 'react-native';
import {useStack} from '../context/StackContext';
import {SUPPLEMENTS,CATEGORIES} from '../data/supplements';
import {CategoryBadge,SectionLabel,MetricCard,StackCard,EmptyState} from '../components';
import {Colors,Spacing,Radius} from '../theme';
export default function StackScreen() {
  const {stack,addItem,removeItem,updateDose,getSummary}=useStack();
  const [query,setQuery]=useState('');
  const [activeCat,setActiveCat]=useState('');
  const [showDrop,setShowDrop]=useState(false);
  const filtered=SUPPLEMENTS.filter(s=>{
    const mc=!activeCat||s.cat===activeCat;
    const mq=!query||s.name.toLowerCase().includes(query.toLowerCase());
    return mc&&mq&&!stack.find(x=>x.id===s.id);
  }).slice(0,12);
  const summary=getSummary();
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDeep}/>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View><Text style={s.logo}>Dose<Text style={s.logoAccent}>Logic</Text></Text><Text style={s.tagline}>Stack analyzer & interaction checker</Text></View>
          <View style={s.avatar}><Text style={s.avatarText}>DL</Text></View>
        </View>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput style={s.searchInput} placeholder="Search supplements, SARMs, peptides…" placeholderTextColor={Colors.silverDim} value={query} onChangeText={t=>{setQuery(t);setShowDrop(t.length>0||activeCat!=='');}} onFocus={()=>setShowDrop(true)} autoCapitalize="none" autoCorrect={false}/>
          {query.length>0&&<TouchableOpacity onPress={()=>{setQuery('');setShowDrop(false);}}><Text style={s.clear}>×</Text></TouchableOpacity>}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
          {CATEGORIES.map(c=>(
            <TouchableOpacity key={c.id} style={[s.pill,activeCat===c.id&&s.pillActive]} onPress={()=>{setActiveCat(c.id);setShowDrop(c.id!==''||query.length>0);}}>
              <Text style={[s.pillText,activeCat===c.id&&s.pillTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {showDrop&&filtered.length>0&&(
          <View style={s.dropdown}>
            {filtered.map((item,i)=>(
              <TouchableOpacity key={item.id} style={[s.dropItem,i<filtered.length-1&&s.dropBorder]} onPress={()=>{addItem(item.id);setQuery('');setShowDrop(false);}}>
                <View style={s.dropLeft}>
                  <Text style={s.dropName}>{item.name}{item.sarmFlag?'  🔴':''}{item.peptideFlag?'  🟣':''}</Text>
                  <Text style={s.dropSub}>{item.defaultDose} {item.unit} default{item.ul?' · UL: '+item.ul+' '+item.unit:''}</Text>
                </View>
                <CategoryBadge cat={item.cat}/>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <SectionLabel>Current Stack</SectionLabel>
        {stack.length===0?<EmptyState emoji="💊" text={'Search above to add supplements,
SARMs, or peptides'}/>:stack.map(item=><StackCard key={item.id} item={item} onRemove={removeItem} onDoseChange={updateDose}/>)}
        <SectionLabel style={{marginTop:Spacing.xl}}>Summary</SectionLabel>
        <View style={s.grid}>
          <MetricCard value={summary.total} label="Items"/>
          <MetricCard value={summary.overlaps} label="Overlaps" valueColor={summary.overlaps>0?Colors.warn:undefined}/>
          <MetricCard value={summary.risks} label="Risks" valueColor={summary.risks>0?Colors.danger:Colors.ok}/>
        </View>
        <View style={{height:Spacing.xxl}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:Colors.bgDeep}, scroll:{flex:1}, content:{padding:Spacing.xl,paddingBottom:0},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:Spacing.lg},
  logo:{fontSize:28,fontWeight:'700',color:Colors.white,letterSpacing:-0.5},
  logoAccent:{color:Colors.purpleBright}, tagline:{fontSize:12,color:Colors.silverDim,marginTop:2},
  avatar:{width:42,height:42,borderRadius:21,backgroundColor:Colors.purpleMid,alignItems:'center',justifyContent:'center'},
  avatarText:{fontSize:14,fontWeight:'700',color:Colors.white},
  searchBox:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,paddingHorizontal:Spacing.md,paddingVertical:12,marginBottom:Spacing.sm},
  searchIcon:{fontSize:14}, searchInput:{flex:1,fontSize:15,color:Colors.white,padding:0},
  clear:{fontSize:20,color:Colors.silverDim,paddingHorizontal:4},
  catScroll:{marginBottom:Spacing.md}, catContent:{gap:Spacing.sm,paddingRight:Spacing.xl},
  pill:{paddingHorizontal:14,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:Colors.border,backgroundColor:Colors.bgCard},
  pillActive:{backgroundColor:Colors.purpleGlow,borderColor:Colors.purpleBright},
  pillText:{fontSize:12,fontWeight:'500',color:Colors.silverDim},
  pillTextActive:{color:Colors.purpleSoft},
  dropdown:{backgroundColor:Colors.bgElevated,borderWidth:1,borderColor:Colors.borderBright,borderRadius:Radius.lg,marginBottom:Spacing.md,overflow:'hidden'},
  dropItem:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:Spacing.md,paddingVertical:12},
  dropBorder:{borderBottomWidth:1,borderBottomColor:Colors.border},
  dropLeft:{flex:1,marginRight:Spacing.sm},
  dropName:{fontSize:14,fontWeight:'500',color:Colors.white},
  dropSub:{fontSize:11,color:Colors.silverDim,marginTop:2},
  grid:{flexDirection:'row',gap:Spacing.sm,marginBottom:Spacing.lg},
});