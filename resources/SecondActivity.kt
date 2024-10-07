package com.example.androidpoc


import android.os.Bundle
import android.util.Log


import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SecondActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        intent.getStringExtra("selectedApps")?.let { Log.d("HI", it) }
        setContentView(R.layout.activity_second)
        val btnBackRNScreen = findViewById<Button>(R.id.btnBackRNScreen)
        btnBackRNScreen.setOnClickListener { finish() }
    }
}