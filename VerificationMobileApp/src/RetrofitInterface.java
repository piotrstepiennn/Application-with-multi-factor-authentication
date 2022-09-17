package com.example.verificationmobileapp;

import android.database.Observable;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface RetrofitInterface {

    @POST("auth/mobileLogin")
    Call<LoginResult> executeLogin(@Body HashMap <String, String>map);



}
