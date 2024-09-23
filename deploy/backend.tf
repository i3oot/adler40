terraform {
  backend "gcs" {
    bucket = "adler40-tofu"
    prefix = "adler40"
  }
}
