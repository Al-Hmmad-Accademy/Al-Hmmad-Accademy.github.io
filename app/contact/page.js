'use client';

import Reveal from '../../components/Reveal';

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you. Our team will contact you.');
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Contact</div>

          <h1
            style={{
              fontSize: 'clamp(45px,7vw,80px)',
              marginTop: 18,
            }}
          >
            Let’s talk about the next step.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">

          <Reveal>
            <div
              className="card"
              style={{
                padding: 28,
              }}
            >
              <div className="eyebrow">
                Enquiry
              </div>

              <h2
                style={{
                  margin: '15px 0',
                }}
              >
                Send a message.
              </h2>

              <form
                className="form-grid"
                onSubmit={handleSubmit}
              >
                <div className="field">
                  <label>Name</label>

                  <input
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="field">
                  <label>Phone</label>

                  <input
                    placeholder="03xx xxxxxxx"
                  />
                </div>

                <div className="field full">
                  <label>Message</label>

                  <textarea
                    rows="6"
                    placeholder="Tell us what you need"
                  />
                </div>

                <div className="field full">
                  <button
                    type="submit"
                    className="btn primary"
                  >
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </Reveal>

          <Reveal>
            <div>

              <div className="list">

                <div className="list-row">
                  <b>Phone</b>
                  <span>
                    Academy reception
                  </span>
                </div>

                <div className="list-row">
                  <b>Email</b>
                  <span>
                    info@stepacademy.example
                  </span>
                </div>

                <div className="list-row">
                  <b>Hours</b>
                  <span>
                    Mon–Sat · 8:00–18:00
                  </span>
                </div>

              </div>

              <div
                className="card"
                style={{
                  padding: 28,
                  marginTop: 18,
                }}
              >
                <h3>
                  Need portal access?
                </h3>

                <p className="lead">
                  Students, teachers and
                  administrators can use the
                  secure login portal.
                </p>

                <a
                  className="btn"
                  href="/login"
                >
                  Open Login
                </a>
              </div>

            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}