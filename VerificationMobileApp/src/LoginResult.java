package com.example.verificationmobileapp;

import com.google.gson.annotations.SerializedName;

public class LoginResult {

    private String username;

    private String email;

    private String password;

    private String code;

    public String getName() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getCode(){return code;}

    public String getEmail(){return email;}
}
