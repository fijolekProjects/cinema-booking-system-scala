package com.faleknatalia.cinemaBookingSystem.movie

import slick.jdbc
import slick.jdbc.JdbcBackend
import slick.jdbc.PostgresProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

//raczej zrobilbym class MovieService(db: jdbc.JdbcBackend.Database)(implicit ec: ExecutionContext)
class MovieService() {

   def addNewMovie(db: jdbc.JdbcBackend.Database, movieForm: AddMovie, movies: TableQuery[MovieTable])
                  (implicit ec: ExecutionContext) : Future[Unit] = {
     val movie = Movie(
       title = movieForm.title,
       description = movieForm.description,
       durationInSeconds = movieForm.durationInSeconds,
       imageUrl = movieForm.imageUrl
     )
     val addMovie = movies += movie
     db.run(addMovie).map(_ => ())
  }

  //movies: TableQuery[MovieTable] powinno byc zdefiniowane gdzies w MovieService a nie na zewnatrz
  def findAllMovies(db: JdbcBackend.Database, movies: TableQuery[MovieTable])
                   (implicit ec: ExecutionContext): Future[Seq[Movie]] = {
//    val findAllMoviesQuery = movies.map { movie =>
//      //ten mapTo moze byc troche niebiezpieczny jak np zamienisz pola (ktore maja taki sam typ, np title z description) miejscami w Movie
//      // to wartosci zle sie podstawia
//      (movie.id, movie.title, movie.description, movie.durationInSeconds, movie.imageUrl).mapTo[Movie]
//    }
    //a w ogole to chyba wystarczy `db.run(movies.result)` tak jak nizej i sie samo mapuje bo zdefiniowalas juz mapowanie w MovieTable.*
    db.run(movies.result)
  }

  def findAllScheduledMovies(db: JdbcBackend.Database, scheduledMovies: TableQuery[ScheduledMovieTable], movies: TableQuery[MovieTable])
                                    (implicit ec: ExecutionContext): Future[Seq[ScheduledMovieDto]] = {
    val allScheduledMoviesQuery = scheduledMovies.join(movies).on(_.movieId === _.id)
    db.run(allScheduledMoviesQuery.result).map { scheduledMovies =>
      scheduledMovies.map { case (scheduledMovie, movie) =>
        val start = scheduledMovie.dateOfProjection
        ScheduledMovieDto(movie.title, start, start.plusSeconds(movie.durationInSeconds))
      }
    }
  }
}
