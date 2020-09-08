package com.faleknatalia.cinemaBookingSystem.movie

import java.time.LocalDateTime

import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

class ScheduledMovieTable(tag: Tag) extends Table[ScheduledMovie](tag, "scheduled_movie") {
  def movieId = column[Long]("movie_id")

  //Daty jest dobrze trzymac w bazie w UTC0 a potem przy zwracaniu w backendzie lub w UI zmieniac strefe czasowa
  def dateOfProjection = column[LocalDateTime]("date_of_projection")

  def cinemaHallId = column[Long]("cinema_hall_id")

  def * = (movieId, dateOfProjection, cinemaHallId).mapTo[ScheduledMovie]
}
