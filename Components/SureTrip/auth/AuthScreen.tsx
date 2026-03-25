import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, 
  Platform, Image, ScrollView, Alert } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../config/api';

export default function AuthScreen() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Validation', 'Please enter your email');
      return;
    }

    try {
      const Receive = await fetch(`${API_BASE}/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      if (Receive.status === 404) {
        Alert.alert(
          "No User Found", 
          "Would you like to create a new account instead?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => handleSignUp() }
          ],
          { cancelable: true }
        );
      } else if (Receive.status === 200) {
        const data = await Receive.json();
        const storedUid = data.uid || data.user?.uid;
        setUid(storedUid);
        console.log("data", Receive);
        login(storedUid, name.trim(), email.trim(), data.user?.role, data.user?.shopName, data.user?.shopCategory, data.user?.shopAddress); // No fallback, so it correctly routes to RoleSelectScreen if role is null
      } else {
        console.log("Login failed with status:", Receive.status);
        const errorData = await Receive.json().catch(() => ({}));
        console.log("Error details:", errorData);
        Alert.alert('Error', `Login failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log('Error', error);
      Alert.alert('Network Error', 'Login / Sign up failed. Please check your connection.');
    }
  };

  const handleSignUp = async () => {
    if ( !email.trim()) {
      Alert.alert('Validation', 'Please enter your email');
      return;
    }

    try {
      const Receive = await fetch(`${API_BASE}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      if (Receive.status === 409) {
        Alert.alert("USER ALREADY EXISTS" , 'LOGIN AS NEW USER TO CONTINUE');

      } else if (Receive.status === 201) {
        const data = await Receive.json();
        const storedUid = data.uid || data.user?.uid;
        setUid(storedUid);
        console.log("data", Receive);
        login(storedUid, name.trim(), email.trim(), data.user?.role, data.user?.shopName, data.user?.shopCategory, data.user?.shopAddress); // Omit 'buyer' default so it routes to RoleSelectScreen if role is null
      } else if (Receive.status === 200) {
        // User already existed but syncing returned 200
        const data = await Receive.json();
        const storedUid = data.uid || data.user?.uid;
        setUid(storedUid);
        login(storedUid, name.trim(), email.trim(), data.user?.role, data.user?.shopName, data.user?.shopCategory, data.user?.shopAddress);
      } else {
        console.log("Signup failed with status:", Receive.status);
        const errorData = await Receive.json().catch(() => ({}));
        console.log("Error details:", errorData);
        Alert.alert('Error', `Signup failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log('Error', error);
      Alert.alert('Network Error', 'Login / Sign up failed. Please check your connection.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Feather name="map-pin" size={36} color="#11706b" />
          </View>
          <Text style={styles.appName}>SureTrip</Text>
          <Text style={styles.tagline}>Find what you need, nearby.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subText}>Create an account or sign in to continue</Text>

          {/* <View style={styles.inputWrapper}>
            <Feather name="user" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View> */}

          <View style={styles.inputWrapper}>
            <Feather name="mail" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeIcon}>
              <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialButton} disabled>
            <Feather name="globe" size={20} color="#555" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} disabled>
            <Feather name="smartphone" size={20} color="#555" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { paddingHorizontal: 28, paddingTop: 80, paddingBottom: 40 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  appName: { fontSize: 30, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: '#888', marginTop: 4 },
  form: {},
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 6 },
  subText: { fontSize: 15, color: '#888', marginBottom: 28 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 14, paddingHorizontal: 16, height: 54, marginBottom: 14, borderWidth: 1, borderColor: '#EBEBEB' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111' },
  eyeIcon: { padding: 4 },
  primaryButton: { backgroundColor: '#11706b', borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  primaryButtonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EBEBEB' },
  dividerText: { marginHorizontal: 14, color: '#999', fontSize: 14 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#EBEBEB', borderRadius: 14, height: 54, paddingHorizontal: 18, marginBottom: 12, backgroundColor: '#FAFAFA' },
  socialButtonText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#555', marginLeft: 12 },
  comingSoonBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  comingSoonText: { fontSize: 11, color: '#888', fontWeight: '600' },
});
