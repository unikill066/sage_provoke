# src/server_tornado.py
import os, tornado.ioloop
from pyrestful import mediatypes
from pyrestful.rest import get, post, RestHandler, RestService

# Import the pre-configured Crew instance and output path from `crew.py`
from crew import crew as crew_extract, TRANS_EXTRACTOR_DRAFT_PATH

os.makedirs("output", exist_ok=True)

# `crew_extract` is imported from `crew.py` – no need to redeclare it here.


class ExtractService(RestHandler):
    def _do_extract(self, transcript):
        if not transcript:
            self.set_status(400)
            return {"error": "Missing 'transcript'."}

        crew_extract.kickoff(inputs={"transcript": transcript})
        path = TRANS_EXTRACTOR_DRAFT_PATH
        if not os.path.exists(path):
            self.set_status(500)
            return {"error": "Extraction failed."}

        return {"prompt": open(path).read().strip()}

    @get(
        _path="/extract",
        _produces=mediatypes.APPLICATION_JSON,
        _query=[{"name": "transcript", "type": str, "required": True}],
    )
    def extract_get(self, transcript):
        return self._do_extract(transcript)

    @post(
        _path="/extract",
        _consumes=mediatypes.APPLICATION_JSON,
        _produces=mediatypes.APPLICATION_JSON,
    )
    def extract_post(self, body):
        transcript = body.get("transcript")
        return self._do_extract(transcript)


if __name__ == "__main__":
    print("🚀 Starting Tornado + pyRestful on http://0.0.0.0:8000")
    app = RestService([ExtractService])
    app.listen(8000)
    tornado.ioloop.IOLoop.instance().start()