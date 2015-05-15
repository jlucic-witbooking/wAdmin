package com.witbooking.admin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.witbooking.admin.domain.FrontEndMessage;
import com.witbooking.admin.repository.FrontEndMessageRepository;
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
 * REST controller for managing FrontEndMessage.
 */
@RestController
@RequestMapping("/api")
public class FrontEndMessageResource {

    private final Logger log = LoggerFactory.getLogger(FrontEndMessageResource.class);

    @Inject
    private FrontEndMessageRepository frontEndMessageRepository;

    /**
     * POST  /frontEndMessages -> Create a new frontEndMessage.
     */
    @RequestMapping(value = "/frontEndMessages",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody FrontEndMessage frontEndMessage) throws URISyntaxException {
        log.debug("REST request to save FrontEndMessage : {}", frontEndMessage);
        if (frontEndMessage.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new frontEndMessage cannot already have an ID").build();
        }
        frontEndMessageRepository.save(frontEndMessage);
        return ResponseEntity.created(new URI("/api/frontEndMessages/" + frontEndMessage.getId())).build();
    }

    /**
     * PUT  /frontEndMessages -> Updates an existing frontEndMessage.
     */
    @RequestMapping(value = "/frontEndMessages",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody FrontEndMessage frontEndMessage) throws URISyntaxException {
        log.debug("REST request to update FrontEndMessage : {}", frontEndMessage);
        if (frontEndMessage.getId() == null) {
            return create(frontEndMessage);
        }
        frontEndMessageRepository.save(frontEndMessage);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /frontEndMessages -> get all the frontEndMessages.
     */
    @RequestMapping(value = "/frontEndMessages",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<FrontEndMessage>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<FrontEndMessage> page = frontEndMessageRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/frontEndMessages", offset, limit);
        return new ResponseEntity<List<FrontEndMessage>>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /frontEndMessages/:id -> get the "id" frontEndMessage.
     */
    @RequestMapping(value = "/frontEndMessages/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<FrontEndMessage> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get FrontEndMessage : {}", id);
        FrontEndMessage frontEndMessage = frontEndMessageRepository.findOne(id);
        if (frontEndMessage == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(frontEndMessage, HttpStatus.OK);
    }

    /**
     * DELETE  /frontEndMessages/:id -> delete the "id" frontEndMessage.
     */
    @RequestMapping(value = "/frontEndMessages/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete FrontEndMessage : {}", id);
        frontEndMessageRepository.delete(id);
    }
}
