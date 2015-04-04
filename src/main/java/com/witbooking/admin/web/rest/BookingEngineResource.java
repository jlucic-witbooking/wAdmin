package com.witbooking.admin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.witbooking.admin.domain.BookingEngine;
import com.witbooking.admin.repository.BookingEngineRepository;
import com.witbooking.admin.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing BookingEngine.
 */
@RestController
@RequestMapping("/api")
public class BookingEngineResource {

    private final Logger log = LoggerFactory.getLogger(BookingEngineResource.class);

    @Inject
    private BookingEngineRepository bookingEngineRepository;

    /**
     * POST  /bookingEngines -> Create a new bookingEngine.
     */
    @RequestMapping(value = "/bookingEngines",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody BookingEngine bookingEngine) throws URISyntaxException {
        log.debug("REST request to save BookingEngine : {}", bookingEngine);
        if (bookingEngine.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new bookingEngine cannot already have an ID").build();
        }
        bookingEngineRepository.save(bookingEngine);
        return ResponseEntity.created(new URI("/api/bookingEngines/" + bookingEngine.getId())).build();
    }

    /**
     * PUT  /bookingEngines -> Updates an existing bookingEngine.
     */
    @RequestMapping(value = "/bookingEngines",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody BookingEngine bookingEngine) throws URISyntaxException {
        log.debug("REST request to update BookingEngine : {}", bookingEngine);
        if (bookingEngine.getId() == null) {
            return create(bookingEngine);
        }
        bookingEngineRepository.save(bookingEngine);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /bookingEngines -> get all the bookingEngines.
     */
    @RequestMapping(value = "/bookingEngines",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<BookingEngine>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<BookingEngine> page = bookingEngineRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bookingEngines", offset, limit);
        return new ResponseEntity<List<BookingEngine>>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /bookingEngines/:id -> get the "id" bookingEngine.
     */
    @RequestMapping(value = "/bookingEngines/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BookingEngine> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get BookingEngine : {}", id);
        BookingEngine bookingEngine = bookingEngineRepository.findOne(id);
        if (bookingEngine == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(bookingEngine, HttpStatus.OK);
    }

    /**
     * DELETE  /bookingEngines/:id -> delete the "id" bookingEngine.
     */
    @RequestMapping(value = "/bookingEngines/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete BookingEngine : {}", id);
        bookingEngineRepository.delete(id);
    }
}
