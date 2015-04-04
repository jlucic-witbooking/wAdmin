package com.witbooking.admin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.witbooking.admin.domain.Right;
import com.witbooking.admin.repository.RightRepository;
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
 * REST controller for managing Right.
 */
@RestController
@RequestMapping("/api")
public class RightResource {

    private final Logger log = LoggerFactory.getLogger(RightResource.class);

    @Inject
    private RightRepository rightRepository;

    /**
     * POST  /rights -> Create a new right.
     */
    @RequestMapping(value = "/rights",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Right right) throws URISyntaxException {
        log.debug("REST request to save Right : {}", right);
        if (right.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new right cannot already have an ID").build();
        }
        rightRepository.save(right);
        return ResponseEntity.created(new URI("/api/rights/" + right.getId())).build();
    }

    /**
     * PUT  /rights -> Updates an existing right.
     */
    @RequestMapping(value = "/rights",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Right right) throws URISyntaxException {
        log.debug("REST request to update Right : {}", right);
        if (right.getId() == null) {
            return create(right);
        }
        rightRepository.save(right);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /rights -> get all the rights.
     */
    @RequestMapping(value = "/rights",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Right>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Right> page = rightRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/rights", offset, limit);
        return new ResponseEntity<List<Right>>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /rights/:id -> get the "id" right.
     */
    @RequestMapping(value = "/rights/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Right> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get Right : {}", id);
        Right right = rightRepository.findOne(id);
        if (right == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(right, HttpStatus.OK);
    }

    /**
     * DELETE  /rights/:id -> delete the "id" right.
     */
    @RequestMapping(value = "/rights/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Right : {}", id);
        rightRepository.delete(id);
    }
}
