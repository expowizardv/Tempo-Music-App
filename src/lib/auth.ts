import { supabase } from './supabase';

async function ensureProfile(userId: string, email: string) {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existingProfile) {
    const { error } = await supabase
      .from('profiles')
      .insert({ id: userId, email })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore unique violation errors
      console.error('Failed to create profile:', error);
      throw new Error('Failed to create profile');
    }
  }
}

export async function signUp(email: string, password: string) {
  // Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (signUpError) throw signUpError;
  if (!signUpData.user) throw new Error('Signup failed');
  
  // Create their profile
  await ensureProfile(signUpData.user.id, email);
  
  // Automatically sign them in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (signInError) throw signInError;
  
  return signInData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  if (data.user) {
    await ensureProfile(data.user.id, email);
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}