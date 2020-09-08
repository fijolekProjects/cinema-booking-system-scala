package com.faleknatalia.cinemaBookingSystem.movie

case class Movie(
                  id: Long = 1L, //dlaczego domyslny parametr? jak juz to -1 albo wcale?
                  title: String,
                  description: String,
                  durationInSeconds: Long,
                  imageUrl: String //zamiast Stringa to mogloby byc np java.net.URI
                )
