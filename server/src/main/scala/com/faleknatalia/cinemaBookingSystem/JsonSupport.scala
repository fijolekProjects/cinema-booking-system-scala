package com.faleknatalia.cinemaBookingSystem

import java.time.LocalDateTime

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import com.faleknatalia.cinemaBookingSystem.cinemahall.{CinemaHall, Seat}
import com.faleknatalia.cinemaBookingSystem.movie.{AddMovie, Movie, ScheduledMovie, ScheduledMovieDto}
import spray.json.{DefaultJsonProtocol, JsString, JsValue, JsonFormat}

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val localDateTimeFormat: JsonFormat[LocalDateTime] = new JsonFormat[LocalDateTime] {
    override def read(json: JsValue): LocalDateTime = ???

    override def write(obj: LocalDateTime): JsValue = JsString(obj.toString)
  }
  implicit val scheduledMovieFormat = jsonFormat3(ScheduledMovie)
  implicit val addMovieFormat = jsonFormat4(AddMovie)
  implicit val movieFormat = jsonFormat5(Movie)
  implicit val ScheduledMovieDtoFormat = jsonFormat3(ScheduledMovieDto)
  implicit val SeatFormat = jsonFormat4(Seat)
  implicit val CinemaHallFormat = jsonFormat2(CinemaHall)
}
