package model

import java.time.LocalDateTime

case class ScheduledMovie(
                         movieId: Long,
                         dateOfProjection: LocalDateTime,
                         cinemaHallId: Long
                         )
